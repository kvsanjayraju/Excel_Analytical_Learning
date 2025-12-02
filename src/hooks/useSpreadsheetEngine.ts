import { useState, useCallback, useRef } from 'react';
import type { Cells, ActionLog, Mode } from '../types/spreadsheet';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useSpreadsheetEngine = (initialCells: Cells = {}) => {
  const [cells, setCells] = useState<Cells>(initialCells);
  const [selectedCell, setSelectedCell] = useState<string>("A1");
  const [mode, setMode] = useState<Mode>("Ready");
  const [logs, setLogs] = useState<ActionLog[]>([]);

  // Dependency graph: key = cell ID, value = list of cells that depend on key
  const dependentsRef = useRef<Record<string, string[]>>({});

  const logAction = useCallback((action: Omit<ActionLog, 'id' | 'timestamp'>) => {
    const newLog: ActionLog = {
      ...action,
      id: generateId(),
      timestamp: Date.now(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  }, []);

  const selectCell = useCallback((cell: string) => {
    if (cell === selectedCell && mode === "Ready") return;

    setSelectedCell(cell);
    if (mode === "Edit") {
      setMode("Ready");
    }
  }, [selectedCell, mode]);

  const enterEditMode = useCallback(() => {
    if (mode === "Edit") return;
    const oldMode = mode;
    setMode("Edit");
    logAction({
      type: "edit-start",
      cell: selectedCell,
      modeBefore: oldMode,
      modeAfter: "Edit",
      before: { formula: cells[selectedCell]?.formula || "", value: cells[selectedCell]?.value ?? null }
    });
  }, [mode, selectedCell, cells, logAction]);

  const evaluateFormula = (formula: string, currentCells: Cells): number | string | null => {
    if (!formula.startsWith('=')) {
        const num = parseFloat(formula);
        return isNaN(num) ? formula : num;
    }

    const expression = formula.substring(1).toUpperCase();

    // Replace references with values
    const parsedExpr = expression.replace(/[A-H][1-6]/g, (match) => {
      const val = currentCells[match]?.value;
      if (typeof val === 'number') return val.toString();
      if (typeof val === 'string' && !isNaN(parseFloat(val))) return val;
      return "0";
    });

    try {
      // Basic arithmetic only
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + parsedExpr)();
      if (result === Infinity || result === -Infinity || isNaN(result)) return "#ERR";
      return result;
    } catch (e) {
      return "#ERR";
    }
  };

  // Build dependency map for a single cell based on its new formula
  const updateDependencies = (cell: string, formula: string, currentDeps: Record<string, string[]>) => {
    const references = formula.match(/[A-H][1-6]/g) || [];

    // Remove 'cell' from all lists in currentDeps
    Object.keys(currentDeps).forEach(key => {
        currentDeps[key] = currentDeps[key].filter(d => d !== cell);
    });

    // Add 'cell' to the lists of referenced cells
    references.forEach(ref => {
        if (!currentDeps[ref]) currentDeps[ref] = [];
        if (!currentDeps[ref].includes(cell)) currentDeps[ref].push(cell);
    });
  };

  const commitEdit = useCallback((cellId: string, formula: string) => {
    const oldCell = cells[cellId];

    updateDependencies(cellId, formula, dependentsRef.current);

    const newVal = evaluateFormula(formula, cells);

    const newCells = {
        ...cells,
        [cellId]: { formula, value: newVal }
    };

    const queue = [...(dependentsRef.current[cellId] || [])];
    const visited = new Set<string>();
    const affectedCells: string[] = [];

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (visited.has(currentId)) continue;
        visited.add(currentId);
        affectedCells.push(currentId);

        const currentFormula = newCells[currentId]?.formula || "";
        const currentVal = evaluateFormula(currentFormula, newCells);
        newCells[currentId] = { ...newCells[currentId], value: currentVal };

        if (dependentsRef.current[currentId]) {
            queue.push(...dependentsRef.current[currentId]);
        }
    }

    setCells(newCells);
    setMode("Ready");

    logAction({
        type: "edit-commit",
        cell: cellId,
        modeBefore: "Edit",
        modeAfter: "Ready",
        before: { formula: oldCell?.formula || "", value: oldCell?.value },
        after: { formula, value: newVal },
        affectedCells: affectedCells.length > 0 ? affectedCells : undefined
    });

    if (affectedCells.length > 0) {
         logAction({
            type: "recalc",
            affectedCells
         });
    }

  }, [cells, logAction]);

  const cancelEdit = useCallback(() => {
    setMode("Ready");
  }, []);

  // Accessor for dependents to show in UI
  const getDependents = useCallback((cellId: string) => {
     // This is "who depends on cellId"
     return dependentsRef.current[cellId] || [];
  }, []);

  return {
    cells,
    selectedCell,
    mode,
    logs,
    selectCell,
    enterEditMode,
    commitEdit,
    cancelEdit,
    setMode,
    logAction,
    getDependents
  };
};
