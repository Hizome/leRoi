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
          engineShapes={game.engineShapes}
          eraseDrawablesOnClick={game.eraseDrawablesOnClick}
          sfen={game.sfen}
          userShapes={game.userShapes}
          setBoardShapes={game.setBoardShapes}
          playUserDrop={game.playUserDrop}
          playUserMove={game.playUserMove}
        />
        <BoardBar color="sente" position={game.position} />
      </main>

      <AnalysisPanel
        autoPromote={game.autoPromote}
        moves={game.moves}
        sfen={game.sfen}
        clearBoardShapes={game.clearBoardShapes}
        eraseDrawablesOnClick={game.eraseDrawablesOnClick}
        setShouldEraseDrawablesOnClick={game.setShouldEraseDrawablesOnClick}
        setShouldAutoPromote={game.setShouldAutoPromote}
        setShouldShowEngineArrows={game.setShouldShowEngineArrows}
        shapeCount={game.userShapes.length}
        showEngineArrows={game.showEngineArrows}
      />
    </div>
  );
}
