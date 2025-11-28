import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import type { GridState } from '../types/lesson';
import { evaluateGrid } from '../lib/gridUtils';

interface GridProps {
  initialState?: GridState;
  onCellChange?: (cellId: string, value: string) => void;
  readOnly?: boolean;
  highlightCells?: string[]; // IDs to highlight
}

const ROWS = 10;
const COLS = 8; // A to H

export const Grid: React.FC<GridProps> = ({
  initialState = {},
  onCellChange,
  readOnly = false,
  highlightCells = []
}) => {
  const [grid, setGrid] = useState<GridState>(initialState);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // Sync with props if they change deeply (simple check)
  useEffect(() => {
    setGrid(evaluateGrid(initialState));
  }, [initialState]);

  const handleCellClick = (cellId: string) => {
    if (readOnly) return;
    setSelectedCell(cellId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, cellId: string) => {
    const newVal = e.target.value;
    const isFormula = newVal.startsWith('=');

    const updatedCell = {
      ...grid[cellId],
      id: cellId,
      value: isFormula ? null : (isNaN(Number(newVal)) ? newVal : Number(newVal)), // Simplified typing
      formula: isFormula ? newVal : undefined,
    };

    const newGrid = { ...grid, [cellId]: updatedCell };
    // Re-evaluate
    const evaluatedGrid = evaluateGrid(newGrid);
    setGrid(evaluatedGrid);

    if (onCellChange) {
      onCellChange(cellId, newVal);
    }
  };

  const renderHeader = () => (
    <div className="flex">
      <div className="w-10 h-8 bg-slate-100 border-r border-b border-slate-300"></div>
      {Array.from({ length: COLS }).map((_, i) => (
        <div key={i} className="w-24 h-8 bg-slate-100 border-r border-b border-slate-300 flex items-center justify-center font-semibold text-xs text-slate-500">
          {String.fromCharCode(65 + i)}
        </div>
      ))}
    </div>
  );

  const renderRow = (rowIndex: number) => (
    <div key={rowIndex} className="flex">
      <div className="w-10 h-8 bg-slate-100 border-r border-b border-slate-300 flex items-center justify-center font-semibold text-xs text-slate-500">
        {rowIndex + 1}
      </div>
      {Array.from({ length: COLS }).map((_, colIndex) => {
        const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
        const cell = grid[cellId];
        const isSelected = selectedCell === cellId;
        const isHighlighted = highlightCells.includes(cellId);

        return (
          <div
            key={cellId}
            onClick={() => handleCellClick(cellId)}
            className={clsx(
              "w-24 h-8 border-r border-b border-slate-200 relative",
              isSelected && "ring-2 ring-blue-500 z-10",
              isHighlighted && "bg-yellow-100"
            )}
          >
            {isSelected && !readOnly ? (
              <input
                autoFocus
                className="w-full h-full px-1 text-sm outline-none"
                value={cell?.formula || cell?.value || ""}
                onChange={(e) => handleInputChange(e, cellId)}
                onBlur={() => setSelectedCell(null)}
              />
            ) : (
              <div
                className={clsx(
                  "w-full h-full px-1 flex items-center text-sm truncate cursor-default",
                   cell?.style?.backgroundColor && `bg-[${cell.style.backgroundColor}]`, // Tailwind dynamic classes caveat, handled better via inline style usually
                   typeof cell?.value === 'number' && "justify-right"
                )}
                style={{
                    backgroundColor: cell?.style?.backgroundColor,
                    color: cell?.style?.color,
                    justifyContent: typeof cell?.value === 'number' ? 'flex-end' : 'flex-start'
                }}
              >
                {cell?.display || cell?.value || ""}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="overflow-auto border border-slate-300 rounded shadow-sm bg-white inline-block">
      {renderHeader()}
      {Array.from({ length: ROWS }).map((_, i) => renderRow(i))}
    </div>
  );
};
