import { useMemo, useState } from "react";
import { shogigroundDropDests, shogigroundMoveDests } from "shogiops/compat";
import { initialSfen, makeSfen, parseSfen } from "shogiops/sfen";
import type { Color, Role, SquareName } from "shogiops/types";
import { makePieceName, parseSquareName } from "shogiops/util";
import { pieceCanPromote, pieceForcePromote } from "shogiops/variant/util";
import type { BoardShape, MoveRecord, PendingPromotion } from "@/types/shogi";

export function useShogiGame() {
  const [sfen, setSfen] = useState(() => initialSfen("standard"));
  const [selected, setSelected] = useState<SquareName | null>(null);
  const [selectedHandRole, setSelectedHandRole] = useState<Role | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const [lastMove, setLastMove] = useState<[SquareName, SquareName] | null>(null);
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [autoPromote, setAutoPromote] = useState(false);
  const [orientation, setOrientation] = useState<Color>("sente");
  const [userShapes, setUserShapes] = useState<BoardShape[]>([]);
  const [showEngineArrows, setShowEngineArrows] = useState(true);
  const [eraseDrawablesOnClick, setEraseDrawablesOnClick] = useState(false);

  const position = useMemo(() => parseSfen("standard", sfen).unwrap(), [sfen]);
  const legalMoves = useMemo(() => shogigroundMoveDests(position), [position]);
  const legalDrops = useMemo(() => shogigroundDropDests(position), [position]);
  const selectedDests = selected ? (legalMoves.get(selected) ?? []) : [];
  const selectedDropDests = selectedHandRole
    ? (legalDrops.get(makePieceName({ color: position.turn, role: selectedHandRole })) ?? [])
    : [];
  const engineShapes = useMemo(
    () => (showEngineArrows ? makeEngineHintShapes(legalMoves) : []),
    [legalMoves, showEngineArrows],
  );

  function resetBoard() {
    setSfen(initialSfen("standard"));
    setSelected(null);
    setSelectedHandRole(null);
    setPendingPromotion(null);
    setLastMove(null);
    setMoves([]);
    setUserShapes([]);
  }

  function setBoardOrientation(value: Color) {
    setOrientation(value);
  }

  function setShouldAutoPromote(value: boolean) {
    setAutoPromote(value);
  }

  function setBoardShapes(shapes: BoardShape[]) {
    setUserShapes(shapes);
  }

  function clearBoardShapes() {
    setUserShapes([]);
  }

  function setShouldShowEngineArrows(value: boolean) {
    setShowEngineArrows(value);
  }

  function setShouldEraseDrawablesOnClick(value: boolean) {
    setEraseDrawablesOnClick(value);
  }

  function playUserMove(fromName: SquareName, toName: SquareName, promotion: boolean) {
    const from = parseSquareName(fromName);
    const to = parseSquareName(toName);
    if (from === undefined || to === undefined) return;

    const clone = position.clone();
    const moving = clone.board.get(from);
    if (!moving) return;

    const move = { from, to, promotion };
    if (!clone.isLegal(move)) return;

    clone.play(move);
    setSfen(makeSfen(clone));
    setMoves((current) => [
      ...current,
      {
        number: current.length + 1,
        color: moving.color,
        from: fromName,
        to: toName,
        role: moving.role,
        promotion,
      },
    ]);
    setLastMove([fromName, toName]);
  }

  function playUserDrop(piece: { role: Role }, toName: SquareName, promotion = false) {
    const to = parseSquareName(toName);
    if (to === undefined) return;

    const clone = position.clone();
    const move = { role: piece.role, to };
    if (!clone.isLegal(move)) return;

    clone.play(move);
    setSfen(makeSfen(clone));
    setMoves((current) => [
      ...current,
      {
        number: current.length + 1,
        color: position.turn,
        to: toName,
        role: piece.role,
        promotion,
        drop: true,
      },
    ]);
    setLastMove([toName, toName]);
  }

  function selectHandRole(role: Role) {
    if (position.hands.color(position.turn).get(role) < 1) return;
    setSelected(null);
    setPendingPromotion(null);
    setSelectedHandRole((current) => (current === role ? null : role));
  }

  function choosePromotion(promotion: boolean) {
    if (!pendingPromotion) return;
    playUserMove(pendingPromotion.fromName, pendingPromotion.toName, promotion);
    setPendingPromotion(null);
  }

  function selectSquare(squareName: SquareName) {
    if (pendingPromotion) return;

    const square = parseSquareName(squareName);
    if (square === undefined) return;

    if (selectedHandRole) {
      if (selectedDropDests.includes(squareName)) {
        playUserDrop({ role: selectedHandRole }, squareName);
      }
      setSelectedHandRole(null);
      return;
    }

    const piece = position.board.get(square);
    if (selected && selectedDests.includes(squareName)) {
      const from = parseSquareName(selected);
      if (from === undefined) return;

      const moving = position.board.get(from);
      const capture = position.board.get(square);
      if (!moving) return;

      const mustPromote = pieceForcePromote("standard")(moving, square);
      const canPromote = pieceCanPromote("standard")(moving, from, square, capture);

      if (canPromote && !mustPromote && !autoPromote) {
        setPendingPromotion({
          from,
          fromName: selected,
          role: moving.role,
          to: square,
          toName: squareName,
        });
      } else {
        playUserMove(selected, squareName, mustPromote || (autoPromote && canPromote));
      }
      setSelected(null);
      return;
    }

    if (piece?.color === position.turn) {
      setSelected(squareName);
      setSelectedHandRole(null);
      return;
    }

    setSelected(null);
  }

  return {
    autoPromote,
    engineShapes,
    eraseDrawablesOnClick,
    lastMove,
    moves,
    orientation,
    pendingPromotion,
    position,
    selected,
    selectedDests,
    selectedDropDests,
    selectedHandRole,
    sfen,
    userShapes,
    choosePromotion,
    clearBoardShapes,
    legalDrops,
    legalMoves,
    playUserDrop,
    playUserMove,
    resetBoard,
    selectHandRole,
    selectSquare,
    setBoardShapes,
    setBoardOrientation,
    setShouldAutoPromote,
    setShouldEraseDrawablesOnClick,
    setShouldShowEngineArrows,
    showEngineArrows,
  };
}

const engineHintBrushes = ["engine", "engineAlt", "engineAlt"] as const;

function makeEngineHintShapes(legalMoves: Map<SquareName, SquareName[]>): BoardShape[] {
  const shapes: BoardShape[] = [];

  for (const [orig, dests] of legalMoves) {
    for (const dest of dests) {
      if (shapes.length >= engineHintBrushes.length) return shapes;

      shapes.push({
        orig,
        dest,
        brush: engineHintBrushes[shapes.length],
        description: String(shapes.length + 1),
      });
    }
  }

  return shapes;
}
