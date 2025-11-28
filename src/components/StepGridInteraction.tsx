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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCurrentGrid(evaluateGrid(initialGrid));
  }, [initialGrid]);

  const handleCellChange = (id: string, value: string) => {
    // Grid component handles internal state and evaluation for display
    // We need to update our local state to check for correctness
    // Note: Grid calls onCellChange with the raw input value (formula or literal)

    // We need to reconstruct the grid logic locally or trust the Grid component to pass back the full state?
    // The Grid component in my implementation keeps its own state and just notifies of changes.
    // This is a bit disjointed. Better if Grid was fully controlled or exposed its state.
    // For now, let's update our local copy.

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

    checkCompletion(evaluated);
  };

  const checkCompletion = (gridToCheck: GridState) => {
    if (!expectedCells) return;

    let allMatch = true;
    for (const [key, expectedVal] of Object.entries(expectedCells)) {
      const cell = gridToCheck[key];
      // loose equality for numbers/strings
      // eslint-disable-next-line eqeqeq
      if (cell?.value != expectedVal) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      setSuccess(true);
      setTimeout(onComplete, 1500);
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

      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg animate-bounce">
          Great job! That's correct.
        </div>
      )}
    </div>
  );
};
