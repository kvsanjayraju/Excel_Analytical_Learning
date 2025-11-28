export type CellValue = string | number | null;

export type Cell = {
  id: string; // e.g., "A1"
  value: CellValue;
  formula?: string;
  display?: string; // What is shown (calculated value)
  style?: {
    backgroundColor?: string;
    color?: string;
    border?: string;
  };
};

export type GridState = Record<string, Cell>;

export type StepType = "narrative" | "mcq" | "gridInteraction";

export interface StepBase {
  id: string;
  type: StepType;
}

export interface NarrativeStep extends StepBase {
  type: "narrative";
  text: string; // Markdown supported
  image?: string;
}

export interface McqOption {
  id: string;
  label: string;
}

export interface McqStep extends StepBase {
  type: "mcq";
  prompt: string;
  options: McqOption[];
  correctOptionId: string;
  explanation: string;
}

export interface GridInteractionStep extends StepBase {
  type: "gridInteraction";
  prompt: string;
  initialGrid: GridState; // Sparse map of initial cells
  goalDescription: string;
  // A simple way to check correctness.
  // In a real app, this might be a function or a complex object.
  // Here we will check if specific cells have specific values.
  expectedCells?: Record<string, CellValue>;
}

export type Step = NarrativeStep | McqStep | GridInteractionStep;

export interface Lesson {
  id: string;
  title: string;
  level: number;
  description: string;
  steps: Step[];
}
