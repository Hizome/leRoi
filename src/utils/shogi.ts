import type { Color, Piece, Role } from "shogiops/types";
import type { Notation } from "shogiground/types";

export const ranks = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const;
export const files = [9, 8, 7, 6, 5, 4, 3, 2, 1] as const;

export const pieceTheme = "kanji_light";
export const boardTheme = "wood";
const pieceSetPath = `/assets/pieces/standard/${pieceTheme}`;

export function notationFiles(): Notation {
  return "numeric";
}

export function notationRanks(): Notation {
  return "engine";
}

export const roleAsset: Record<string, string> = {
  pawn: "FU",
  lance: "KY",
  knight: "KE",
  silver: "GI",
  gold: "KI",
  king: "OU",
  bishop: "KA",
  rook: "HI",
  tokin: "TO",
  promotedpawn: "TO",
  promotedlance: "NY",
  promotedknight: "NK",
  promotedsilver: "NG",
  horse: "UM",
  dragon: "RY",
};

export const roleLabel: Record<string, string> = {
  pawn: "歩",
  lance: "香",
  knight: "桂",
  silver: "銀",
  gold: "金",
  king: "玉",
  bishop: "角",
  rook: "飛",
  tokin: "と",
  promotedpawn: "と",
  promotedlance: "成香",
  promotedknight: "成桂",
  promotedsilver: "成銀",
  horse: "馬",
  dragon: "龍",
};

export function pieceImage(piece: Piece) {
  const side = piece.color === "sente" ? "0" : "1";
  return `${pieceSetPath}/${side}${roleAsset[piece.role]}.svg`;
}

export function colorName(color: Color) {
  return color === "sente" ? "先手" : "後手";
}

export function formatMove(move: {
  color: Color;
  drop?: boolean;
  to: string;
  role: Role;
  promotion: boolean;
}) {
  const prefix = move.color === "sente" ? "▲" : "△";
  const drop = move.drop ? "打" : "";
  const promote = move.promotion ? "成" : "";
  return `${prefix}${move.to}${roleLabel[move.role] ?? move.role}${drop}${promote}`;
}

export function promotedPiece(piece: Piece): Piece {
  return {
    ...piece,
    role:
      piece.role === "pawn"
        ? "tokin"
        : piece.role === "lance"
          ? "promotedlance"
          : piece.role === "knight"
            ? "promotedknight"
            : piece.role === "silver"
              ? "promotedsilver"
              : piece.role === "bishop"
                ? "horse"
                : piece.role === "rook"
                  ? "dragon"
                  : piece.role,
  };
}
