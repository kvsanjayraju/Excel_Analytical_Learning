import React, { useState, useEffect } from 'react';
import type { GridState, CellValue } from '../types/lesson';
import { Grid } from './Grid';
import { evaluateGrid } from '../lib/gridUtils';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

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
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    setCurrentGrid(evaluateGrid(initialGrid));
  }, [initialGrid]);

  const handleCellChange = (id: string, value: string) => {
    const isFormula = value.startsWith('=');
    const updatedCell = {
        ...currentGrid[id],
        id,
        value: isFormula ? null : (isNaN(Number(value)) ? value : Number(value)),
        formula: isFormula ? value : undefined,
    };

    const nextGrid = { ...currentGrid, [id]: updatedCell };
    const evaluated = evaluateGrid(nextGrid);
    setCurrentGrid(evaluated);
    // Removed auto-check here
    if (feedback?.type === 'error') {
        setFeedback(null); // Clear error when user types
    }
  };

  const handleCheckAnswer = () => {
    if (!expectedCells) {
        setFeedback({ type: 'success', message: "Great exploration! You can proceed." });
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

    if (allMatch) {
      setFeedback({ type: 'success', message: "✅ Correct! Great job." });
    } else {
      setFeedback({ type: 'error', message: "❌ Not yet. Check the cell and try again." });
    }
  };

  return (
    <div className="space-y-4">
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
          {feedback && (
            <div className={clsx(
                "p-4 rounded-lg",
                feedback.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}>
              {feedback.message}
            </div>
          )}

          <div className="flex gap-4">
              {feedback?.type !== 'success' && (
                  <button
                    onClick={handleCheckAnswer}
                    className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-semibold"
                  >
                    Check Answer
                  </button>
              )}

              {feedback?.type === 'success' && (
                  <button
                    onClick={onComplete}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-semibold"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
              )}
          </div>
      </div>
    </div>
  );
};
