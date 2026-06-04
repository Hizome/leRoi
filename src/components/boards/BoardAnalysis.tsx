import type { useShogiGame } from "@/hooks/useShogiGame";
import { AnalysisPanel } from "./AnalysisPanel";
import { Board } from "./Board";
import { BoardBar } from "./BoardBar";
import { BoardControls } from "./BoardControls";
import classes from "./BoardAnalysis.module.css";

type BoardAnalysisProps = {
  game: ReturnType<typeof useShogiGame>;
};

export default function BoardAnalysis({ game }: BoardAnalysisProps) {
  return (
    <div className={classes.layout}>
      <main className={classes.boardStage}>
        <BoardControls
          orientation={game.orientation}
          resetBoard={game.resetBoard}
          setBoardOrientation={game.setBoardOrientation}
        />
        <BoardBar color="gote" position={game.position} top />
        <Board
          autoPromote={game.autoPromote}
          orientation={game.orientation}
          position={game.position}
          lastMove={game.lastMove}
          legalMoves={game.legalMoves}
          legalDrops={game.legalDrops}
          sfen={game.sfen}
          playUserDrop={game.playUserDrop}
          playUserMove={game.playUserMove}
        />
        <BoardBar color="sente" position={game.position} />
      </main>

      <AnalysisPanel
        autoPromote={game.autoPromote}
        moves={game.moves}
        sfen={game.sfen}
        setShouldAutoPromote={game.setShouldAutoPromote}
      />
    </div>
  );
}
