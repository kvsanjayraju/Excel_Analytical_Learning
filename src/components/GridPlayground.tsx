import React, { useRef, useEffect, useState } from 'react';
import { useSpreadsheetEngine } from '../hooks/useSpreadsheetEngine';
import { clsx } from 'clsx';

interface GridPlaygroundProps {
    engine: ReturnType<typeof useSpreadsheetEngine>;
}

const ROWS = 6;
const COLS = 8; // A-H

export const GridPlayground: React.FC<GridPlaygroundProps> = ({ engine }) => {
    const {
        cells,
        selectedCell,
        mode,
        selectCell,
        enterEditMode,
        commitEdit,
        cancelEdit,
        logAction
    } = engine;

    const [editBuffer, setEditBuffer] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Focus management
    useEffect(() => {
        if (mode === "Edit" && inputRef.current) {
            inputRef.current.focus();
        } else if (mode === "Ready" && gridRef.current) {
            gridRef.current.focus();
        }
    }, [mode, selectedCell]);

    // Sync buffer when entering edit mode
    useEffect(() => {
        if (mode === "Edit") {
            const currentFormula = cells[selectedCell]?.formula;
            if (editBuffer === "" && currentFormula) {
                setEditBuffer(currentFormula);
            }
        } else {
            setEditBuffer("");
        }
    }, [mode, selectedCell, cells]);

    const handleCellClick = (cellId: string) => {
        logAction({ type: "click", cell: cellId });
        selectCell(cellId);
    };

    const handleDoubleClick = (cellId: string) => {
        selectCell(cellId);
        enterEditMode();
        const currentFormula = cells[cellId]?.formula || "";
        setEditBuffer(currentFormula);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (mode === "Ready") {
            if (e.key === 'F2') {
                e.preventDefault();
                enterEditMode();
                const currentFormula = cells[selectedCell]?.formula || "";
                setEditBuffer(currentFormula);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                moveSelection(0, 1);
            } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                // Start typing replaces content
                e.preventDefault();
                enterEditMode();
                setEditBuffer(e.key);
            } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                handleNavigation(e.key);
            }
        } else if (mode === "Edit") {
            e.stopPropagation();
            if (e.key === 'Enter') {
                e.preventDefault();
                commitEdit(selectedCell, editBuffer);
                moveSelection(0, 1);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        }
    };

    const moveSelection = (dCol: number, dRow: number) => {
        const colPart = selectedCell.charCodeAt(0) - 65;
        const rowPart = parseInt(selectedCell.substring(1)) - 1;

        const newCol = Math.max(0, Math.min(COLS - 1, colPart + dCol));
        const newRow = Math.max(0, Math.min(ROWS - 1, rowPart + dRow));

        const newId = `${String.fromCharCode(65 + newCol)}${newRow + 1}`;
        selectCell(newId);
    };

    const handleNavigation = (key: string) => {
        if (key === 'ArrowUp') moveSelection(0, -1);
        if (key === 'ArrowDown') moveSelection(0, 1);
        if (key === 'ArrowLeft') moveSelection(-1, 0);
        if (key === 'ArrowRight') moveSelection(1, 0);
    };

    const renderHeader = () => (
        <div className="flex">
            <div className="w-10 h-8 bg-slate-100 border-r border-b border-slate-300"></div>
            {Array.from({ length: COLS }).map((_, i) => (
                <div key={i} className="flex-1 h-8 bg-slate-100 border-r border-b border-slate-300 flex items-center justify-center font-semibold text-xs text-slate-500">
                    {String.fromCharCode(65 + i)}
                </div>
            ))}
        </div>
    );

    const renderRow = (rowIndex: number) => (
        <div key={rowIndex} className="flex h-10">
            <div className="w-10 bg-slate-100 border-r border-b border-slate-300 flex items-center justify-center font-semibold text-xs text-slate-500">
                {rowIndex + 1}
            </div>
            {Array.from({ length: COLS }).map((_, colIndex) => {
                const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
                const cell = cells[cellId];
                const isSelected = selectedCell === cellId;

                return (
                    <div
                        key={cellId}
                        onClick={() => handleCellClick(cellId)}
                        onDoubleClick={() => handleDoubleClick(cellId)}
                        className={clsx(
                            "flex-1 border-r border-b border-slate-200 relative cursor-cell",
                            isSelected && "ring-2 ring-green-500 z-10"
                        )}
                    >
                        {isSelected && mode === "Edit" ? (
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full h-full px-2 outline-none font-mono text-sm"
                                value={editBuffer}
                                onChange={(e) => setEditBuffer(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        ) : (
                            <div className="w-full h-full px-2 flex items-center overflow-hidden whitespace-nowrap text-sm">
                                {cell?.value}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div
            ref={gridRef}
            className="w-full h-full flex flex-col bg-white rounded shadow select-none outline-none"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {renderHeader()}
            <div className="flex-1 overflow-auto">
                {Array.from({ length: ROWS }).map((_, i) => renderRow(i))}
            </div>
            <div className="p-2 bg-slate-50 text-xs text-slate-500 border-t">
                {mode === "Ready" ? "Ready" : "Edit"} | {selectedCell}
            </div>
        </div>
    );
};
