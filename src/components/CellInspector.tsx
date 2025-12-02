import React, { useEffect, useState } from 'react';
import { useSpreadsheetEngine } from '../hooks/useSpreadsheetEngine';
import { clsx } from 'clsx';

interface CellInspectorProps {
    engine: ReturnType<typeof useSpreadsheetEngine>;
}

export const CellInspector: React.FC<CellInspectorProps> = ({ engine }) => {
    const {
        cells,
        selectedCell,
        mode,
        logs,
        getDependents
    } = engine;

    const lastLog = logs[0];
    const cellData = cells[selectedCell];

    // Animation trigger
    const [highlight, setHighlight] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Flash cards when relevant data changes
        setHighlight(h => ({ ...h, all: true }));
        const t = setTimeout(() => setHighlight(h => ({ ...h, all: false })), 300);
        return () => clearTimeout(t);
    }, [lastLog, selectedCell, mode]);

    // Content Generators

    const getSkinContent = () => {
        if (mode === "Edit") {
            return `Green border around ${selectedCell}. Caret inside cell text.`;
        }
        return `Green border around ${selectedCell}. Value "${cellData?.value ?? ''}" displayed.`;
    };

    const getMusclesContent = () => {
        if (!lastLog) return "Waiting for interaction...";
        const relevantLogs = logs.filter(l => l.type !== 'recalc').slice(0, 3);

        return (
            <ul className="list-disc pl-4 space-y-1">
                {relevantLogs.map(log => (
                    <li key={log.id}>
                        <span className="font-mono text-xs bg-slate-100 p-0.5 rounded">{log.type}</span>
                        {log.modeBefore && log.modeAfter && log.modeBefore !== log.modeAfter && (
                            <span className="ml-1 text-slate-600">
                                ({log.modeBefore} &rarr; {log.modeAfter})
                            </span>
                        )}
                        {log.type === 'click' && ` on ${log.cell}`}
                        {log.type === 'edit-commit' && ` formula="${log.after?.formula}"`}
                    </li>
                ))}
            </ul>
        );
    };

    const getBonesContent = () => {
        const dependents = getDependents(selectedCell);

        return (
            <div className="space-y-2">
                <div>
                    <span className="font-semibold">Cell {selectedCell}:</span>
                </div>
                <div className="pl-2 border-l-2 border-slate-200">
                    <div>formula: <span className="font-mono text-blue-600">{cellData?.formula || "(empty)"}</span></div>
                    <div>value: <span className="font-mono text-green-600">{cellData?.value ?? "(null)"}</span></div>
                </div>
                {dependents.length > 0 && (
                    <div className="mt-2">
                        <span className="font-semibold text-xs text-slate-500 uppercase">Dependents:</span>
                        <div className="font-mono text-sm">{dependents.join(", ")}</div>
                    </div>
                )}
            </div>
        );
    };

    const getAtomsContent = () => {
        const jsType = cellData?.value === null ? "null" : typeof cellData?.value;
        const focus = mode === "Edit" ? "Focus: cell text (input)" : "Focus: grid container";

        return (
            <div className="space-y-1">
                <div>JS Type: <span className="font-mono text-purple-600">{jsType}</span></div>
                <div>{focus}</div>
                <div className="text-xs text-slate-500 mt-2 italic">
                    {mode === "Edit" ? "Buffer in memory." : "Committed to store."}
                </div>
            </div>
        );
    };

    const Card = ({ title, children, color }: { title: string, children: React.ReactNode, color: string }) => (
        <div className={clsx(
            "bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition-all duration-300",
            highlight.all ? "ring-2 ring-blue-100 scale-[1.01]" : ""
        )}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${color}`}>{title}</h3>
            <div className="text-sm text-slate-700">
                {children}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col gap-4 overflow-auto p-1">
            <Card title="Skin" color="text-pink-500">
                {getSkinContent()}
            </Card>
            <Card title="Muscles" color="text-orange-500">
                {getMusclesContent()}
            </Card>
            <Card title="Bones" color="text-blue-500">
                {getBonesContent()}
            </Card>
            <Card title="Atoms" color="text-purple-500">
                {getAtomsContent()}
            </Card>
        </div>
    );
};
