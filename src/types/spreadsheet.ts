export type CellData = {
  formula: string;
  value: string | number | null;
};

export type Cells = Record<string, CellData>;

export type Mode = "Ready" | "Edit";

export type ActionType = "click" | "edit-start" | "edit-commit" | "mode-change" | "recalc";

export type ActionLog = {
  id: string;
  type: ActionType;
  cell?: string;
  modeBefore?: Mode;
  modeAfter?: Mode;
  before?: { formula: string; value: any } | null;
  after?: { formula: string; value: any } | null;
  affectedCells?: string[];
  timestamp: number;
};
