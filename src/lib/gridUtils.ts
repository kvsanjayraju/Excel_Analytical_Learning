import type { GridState } from '../types/lesson';

// Helper to convert "A1" to { col: 0, row: 0 }
export const parseCellId = (id: string) => {
  const colPart = id.match(/[A-Z]+/)?.[0];
  const rowPart = id.match(/\d+/)?.[0];

  if (!colPart || !rowPart) return null;

  // Simple A-Z support for now (0-25)
  const colIndex = colPart.charCodeAt(0) - 65;
  const rowIndex = parseInt(rowPart, 10) - 1;

  return { colIndex, rowIndex };
};

// Helper to evaluate simple formulas
// Supported: Numbers, Strings, simple math (+ - * /), references (A1), SUM(A1:A3)
export const evaluateGrid = (grid: GridState): GridState => {
  const newGrid = { ...grid };

  // Naive 2-pass evaluation (or just re-evaluate everything)
  // For this simplified version, we'll iterate through all cells and evaluate formulas.
  // Ideally, this should be a topological sort.

  const getValue = (cellId: string): number => {
    const cell = newGrid[cellId];
    if (!cell) return 0;
    const val = cell.value;
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && !isNaN(parseFloat(val))) return parseFloat(val);
    return 0; // fallback
  };

  Object.keys(newGrid).forEach(key => {
    const cell = newGrid[key];
    if (cell.formula) {
      if (cell.formula.startsWith('=')) {
        const expression = cell.formula.substring(1).toUpperCase();

        // Handle SUM(A1:A3) - VERY basic implementation
        const sumMatch = expression.match(/SUM\(([A-Z]\d+):([A-Z]\d+)\)/);
        if (sumMatch) {
            const start = parseCellId(sumMatch[1]);
            const end = parseCellId(sumMatch[2]);
            if (start && end) {
                let sum = 0;
                for(let r = start.rowIndex; r <= end.rowIndex; r++) {
                    for(let c = start.colIndex; c <= end.colIndex; c++) {
                        const id = `${String.fromCharCode(65 + c)}${r + 1}`;
                        sum += getValue(id);
                    }
                }
                newGrid[key] = { ...cell, display: sum.toString(), value: sum };
                return;
            }
        }

        // Handle simple arithmetic: A1 + B1
        // We will replace cell references with their values and use eval() (carefully, this is a toy app)
        // Regex to find cell IDs: [A-Z][0-9]+
        const parsedExpr = expression.replace(/[A-Z][0-9]+/g, (match) => {
            return getValue(match).toString();
        });

        try {
          // eslint-disable-next-line no-eval
          const result = eval(parsedExpr);
          newGrid[key] = { ...cell, display: result.toString(), value: result };
        } catch (e) {
          newGrid[key] = { ...cell, display: "#ERROR", value: "#ERROR" };
        }
      } else {
        newGrid[key] = { ...cell, display: cell.formula, value: cell.formula };
      }
    } else {
      // If no formula, display raw value
      newGrid[key] = { ...cell, display: cell.value?.toString() ?? "" };
    }
  });

  return newGrid;
};
