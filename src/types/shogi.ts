import type { Color, Role, Square, SquareName } from "shogiops/types";

export type MoveRecord = {
  number: number;
  color: Color;
  from?: SquareName;
  to: SquareName;
  role: Role;
  promotion: boolean;
  drop?: boolean;
};

export type PendingPromotion = {
  from: Square;
  fromName: SquareName;
  role: Role;
  to: Square;
  toName: SquareName;
};
