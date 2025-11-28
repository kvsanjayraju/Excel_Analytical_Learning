import React, { useState, useEffect } from 'react';
import type { GridState, CellValue } from '../types/lesson';
import { Grid } from './Grid';
import { evaluateGrid } from '../lib/gridUtils';

interface StepGridInteractionProps {
  prompt: string;
  initialGrid: GridState;
  goalDescription: string;
  expectedCells?: Record<string, CellValue>;
  onComplete: () => void;
}

export const StepGridInteraction: React.FC<StepGridInteractionProps> = ({
  prompt,
  initialGrid,
  goalDescription,
  expectedCells,
  onComplete
}) => {
  const [currentGrid, setCurrentGrid] = useState<GridState>(initialGrid);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  useEffect(() => {
    setCurrentGrid(evaluateGrid(initialGrid));
    setStatus('idle');
  }, [initialGrid]);

  const handleCellChange = (id: string, value: string) => {
    // Reset status when user interacts so they can try again
    if (status !== 'idle') setStatus('idle');

    const isFormula = value.startsWith('=');
    const updatedCell = {
        ...currentGrid[id],
        id,
        value: isFormula ? null : (isNaN(Number(value)) ? value : Number(value)),
        formula: isFormula ? value : undefined,
    };

    const nextGrid = { ...currentGrid, [id]: updatedCell };
    const evaluated = evaluateGrid(nextGrid); // Re-evaluate everything
    setCurrentGrid(evaluated);
  };

  const checkCompletion = () => {
    if (!expectedCells) {
        // If nothing expected, just move on? Or treat as correct?
        setStatus('correct');
        return;
    }

    let allMatch = true;
    for (const [key, expectedVal] of Object.entries(expectedCells)) {
      const cell = currentGrid[key];
      // loose equality for numbers/strings
      // eslint-disable-next-line eqeqeq
      if (cell?.value != expectedVal) {
        allMatch = false;
        break;
      }
    }

    setStatus(allMatch ? 'correct' : 'incorrect');
  };

  return (
    <div className="space-y-6">
      <div className="prose prose-slate">
        <h3 className="text-xl font-semibold">{prompt}</h3>
        <p className="text-slate-600">{goalDescription}</p>
      </div>

      <div className="border p-4 rounded-xl bg-slate-50 overflow-x-auto">
        <Grid
          initialState={initialGrid}
          onCellChange={handleCellChange}
        />
      </div>

      <div className="flex flex-col gap-4">
        {status === 'idle' && (
             <button
                onClick={checkCompletion}
                className="self-start py-3 px-8 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors"
             >
                Check Answer
             </button>
        )}

        {status === 'incorrect' && (
             <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-100 flex flex-col items-start gap-2">
                <p className="font-semibold">That's not quite right.</p>
                <p>Check the formula or values and try again.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 text-sm underline text-red-600 hover:text-red-800"
                >
                    Try again
                </button>
             </div>
        )}

        {status === 'correct' && (
            <div className="space-y-4">
                 <div className="p-4 bg-green-100 text-green-800 rounded-lg">
                    <p className="font-bold">Correct!</p>
                 </div>
                 <button
                    onClick={onComplete}
                    className="py-3 px-8 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                 >
                    Next Step
                 </button>
            </div>
        )}
      </div>
    </div>
  );
};
