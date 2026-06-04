import cx from "clsx";
import { useEffect, useMemo, useRef } from "react";
import { forsythToRole, roleToForsyth } from "shogiops/sfen";
import type { Color, Piece, Role, SquareName } from "shogiops/types";
import { parseSquareName } from "shogiops/util";
import { handRoles, pieceCanPromote, pieceForcePromote, promote } from "shogiops/variant/util";
import type { Position } from "shogiops/variant/position";
import { Shogiground } from "shogiground";
import type { Api } from "shogiground/api";
import type { Config } from "shogiground/config";
import type * as sg from "shogiground/types";
import type { BoardShape } from "@/types/shogi";
import { playShogiMoveSound, preloadShogiMoveSounds } from "@/utils/sound";
import { boardTheme } from "@/utils/shogi";
import classes from "./Board.module.css";

type BoardProps = {
  autoPromote: boolean;
  orientation: Color;
  position: Position;
  lastMove: [SquareName, SquareName] | null;
  legalMoves: Map<SquareName, SquareName[]>;
  legalDrops: Map<string, SquareName[]>;
  engineShapes: BoardShape[];
  eraseDrawablesOnClick: boolean;
  sfen: string;
  userShapes: BoardShape[];
  setBoardShapes: (shapes: BoardShape[]) => void;
  playUserDrop: (piece: Piece, toName: SquareName, promotion: boolean) => void;
  playUserMove: (fromName: SquareName, toName: SquareName, promotion: boolean) => void;
};

const animationDuration = 250;

export function Board({
  autoPromote,
  orientation,
  position,
  lastMove,
  legalMoves,
  legalDrops,
  engineShapes,
  eraseDrawablesOnClick,
  sfen,
  userShapes,
  setBoardShapes,
  playUserDrop,
  playUserMove,
}: BoardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const sgRef = useRef<Api | null>(null);
  const config = useMemo(
    () =>
      makeShogigroundConfig({
        lastMove,
        autoPromote,
        legalDrops,
        legalMoves,
        engineShapes,
        eraseDrawablesOnClick,
        orientation,
        playUserDrop,
        playUserMove,
        position,
        setBoardShapes,
        sfen,
        userShapes,
      }),
    [
      autoPromote,
      engineShapes,
      eraseDrawablesOnClick,
      lastMove,
      legalDrops,
      legalMoves,
      orientation,
      playUserDrop,
      playUserMove,
      position,
      setBoardShapes,
      sfen,
      userShapes,
    ],
  );

  useEffect(() => {
    if (!wrapRef.current) return;

    const api = Shogiground(config);
    api.attach({ board: wrapRef.current });
    sgRef.current = api;
    preloadShogiMoveSounds();

    return () => {
      api.destroy();
      sgRef.current = null;
    };
  }, []);

  useEffect(() => {
    sgRef.current?.set(config);
  }, [config]);

  return (
    <div className={cx(classes.mainBoard, classes.standard, classes[boardTheme])}>
      <div ref={wrapRef} className={classes.sgWrap} />
    </div>
  );
}

function makeShogigroundConfig({
  orientation,
  position,
  lastMove,
  autoPromote,
  legalMoves,
  legalDrops,
  engineShapes,
  eraseDrawablesOnClick,
  sfen,
  userShapes,
  setBoardShapes,
  playUserDrop,
  playUserMove,
}: {
  orientation: Color;
  position: Position;
  lastMove: [SquareName, SquareName] | null;
  autoPromote: boolean;
  legalMoves: Map<SquareName, SquareName[]>;
  legalDrops: Map<string, SquareName[]>;
  engineShapes: BoardShape[];
  eraseDrawablesOnClick: boolean;
  sfen: string;
  userShapes: BoardShape[];
  setBoardShapes: (shapes: BoardShape[]) => void;
  playUserDrop: (piece: Piece, toName: SquareName, promotion: boolean) => void;
  playUserMove: (fromName: SquareName, toName: SquareName, promotion: boolean) => void;
}): Config {
  const [boardSfen, , handsSfen] = sfen.split(" ");

  return {
    sfen: {
      board: boardSfen,
      hands: handsSfen,
    },
    orientation,
    turnColor: position.turn,
    activeColor: position.turn,
    lastDests: lastMove ?? undefined,
    coordinates: {
      enabled: true,
      files: "numeric",
      ranks: "numeric",
    },
    highlight: {
      lastDests: true,
      check: true,
    },
    events: {
      move: (_orig, _dest, _promotion, capturedPiece) => {
        playShogiMoveSound(!!capturedPiece);
      },
      drop: () => {
        playShogiMoveSound();
      },
    },
    hands: {
      roles: handRoles("standard"),
      inlined: true,
    },
    movable: {
      free: false,
      dests: legalMoves as sg.MoveDests,
      showDests: true,
      events: {
        after: (orig, dest, promotion) => {
          playUserMove(orig as SquareName, dest as SquareName, promotion);
        },
      },
    },
    droppable: {
      free: false,
      dests: legalDrops as sg.DropDests,
      showDests: true,
      events: {
        after: (piece, key, promotion) => {
          playUserDrop(piece as Piece, key as SquareName, promotion);
        },
      },
    },
    promotion: {
      promotesTo: (role) => promote("standard")(role as Role),
      movePromotionDialog: (orig, dest) => {
        const from = parseSquareName(orig as SquareName);
        const to = parseSquareName(dest as SquareName);
        if (from === undefined || to === undefined) return false;

        const piece = position.board.get(from);
        const capture = position.board.get(to);
        return (
          !!piece &&
          !autoPromote &&
          pieceCanPromote("standard")(piece, from, to, capture) &&
          !pieceForcePromote("standard")(piece, to)
        );
      },
      forceMovePromotion: (orig, dest) => {
        const from = parseSquareName(orig as SquareName);
        const to = parseSquareName(dest as SquareName);
        if (from === undefined || to === undefined) return false;

        const piece = position.board.get(from);
        return (
          !!piece &&
          (pieceForcePromote("standard")(piece, to) ||
            (autoPromote && pieceCanPromote("standard")(piece, from, to, position.board.get(to))))
        );
      },
    },
    forsyth: {
      fromForsyth: forsythToRole("standard"),
      toForsyth: (role) => roleToForsyth("standard")(role as Role),
    },
    animation: {
      enabled: true,
      hands: true,
      duration: animationDuration,
    },
    premovable: {
      enabled: false,
      showDests: true,
    },
    predroppable: {
      enabled: false,
      showDests: true,
    },
    draggable: {
      enabled: true,
      showGhost: true,
      showTouchSquareOverlay: true,
    },
    selectable: {
      enabled: true,
    },
    drawable: {
      enabled: true,
      visible: true,
      eraseOnClick: eraseDrawablesOnClick,
      shapes: userShapes,
      autoShapes: engineShapes,
      onChange: setBoardShapes,
    },
  };
}
