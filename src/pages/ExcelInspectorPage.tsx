import React from 'react';
import { GridPlayground } from '../components/GridPlayground';
import { CellInspector } from '../components/CellInspector';
import { useSpreadsheetEngine } from '../hooks/useSpreadsheetEngine';

export const ExcelInspectorPage: React.FC = () => {
    // Shared engine state
    const engine = useSpreadsheetEngine({
        // Initial data for demo
        "A1": { formula: "10", value: 10 },
        "A2": { formula: "20", value: 20 },
        "B1": { formula: "=A1+A2", value: 30 },
    });

    return (
        <div className="w-full h-screen bg-slate-50 flex flex-col">
            <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 shadow-sm z-10">
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-green-600 text-xl">⯃</span>
                    Excel Inspector
                </h1>
                <div className="ml-auto text-sm text-slate-500">
                    Interactive Teaching Tool
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Left: Grid Playground */}
                <section className="w-[55%] h-full p-6 flex flex-col border-r border-slate-200 bg-slate-100/50">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                        Grid Playground
                    </h2>
                    <div className="flex-1">
                        <GridPlayground engine={engine} />
                    </div>
                    <div className="mt-4 text-xs text-slate-400">
                        Arrow keys to move • Enter to edit/commit • F2 to edit
                    </div>
                </section>

                {/* Right: Inspector */}
                <section className="w-[45%] h-full bg-slate-50 p-6 overflow-y-auto">
                     <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                        Cell Inspector
                    </h2>
                    <CellInspector engine={engine} />
                </section>
            </main>
        </div>
    );
};
