import { ActionIcon, Divider, Group, Kbd, ScrollArea, Stack, Switch, Text, Tooltip } from "@mantine/core";
import { IconArrowUpRight, IconEraser, IconFlag, IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import type { MoveRecord } from "@/types/shogi";
import { formatMove } from "@/utils/shogi";
import classes from "./AnalysisPanel.module.css";

type AnalysisPanelProps = {
  autoPromote: boolean;
  clearBoardShapes: () => void;
  eraseDrawablesOnClick: boolean;
  moves: MoveRecord[];
  setShouldEraseDrawablesOnClick: (value: boolean) => void;
  sfen: string;
  setShouldAutoPromote: (value: boolean) => void;
  setShouldShowEngineArrows: (value: boolean) => void;
  shapeCount: number;
  showEngineArrows: boolean;
};

export function AnalysisPanel({
  autoPromote,
  clearBoardShapes,
  eraseDrawablesOnClick,
  moves,
  setShouldEraseDrawablesOnClick,
  sfen,
  setShouldAutoPromote,
  setShouldShowEngineArrows,
  shapeCount,
  showEngineArrows,
}: AnalysisPanelProps) {
  return (
    <aside className={classes.panel}>
      <Stack gap="sm" h="100%">
        <Group justify="space-between">
          <Text fw={600}>Analysis</Text>
          <Group gap={4}>
            <Tooltip label="Start engine">
              <ActionIcon variant="default" radius={0}>
                <IconPlayerPlay size="1rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Resign">
              <ActionIcon variant="default" radius={0}>
                <IconFlag size="1rem" />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <div className={classes.engineLine}>
          <Text size="xs" c="dimmed">
            Engine
          </Text>
          <Text size="sm">USI engine not connected</Text>
          <div className={classes.evalBar}>
            <span style={{ width: "51%" }} />
          </div>
        </div>

        <Switch
          size="sm"
          label="Auto-promote"
          checked={autoPromote}
          onChange={(event) => setShouldAutoPromote(event.currentTarget.checked)}
        />

        <div className={classes.arrowTools}>
          <Group justify="space-between" gap="xs">
            <Group gap={6}>
              <IconArrowUpRight size="1rem" />
              <Text size="sm" fw={600}>
                Arrows
              </Text>
            </Group>
            <Group gap={4}>
              <Tooltip label="Show engine hint arrows">
                <ActionIcon
                  variant={showEngineArrows ? "filled" : "default"}
                  radius={0}
                  onClick={() => setShouldShowEngineArrows(!showEngineArrows)}
                >
                  <IconArrowUpRight size="1rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Clear drawn arrows">
                <ActionIcon
                  variant="default"
                  radius={0}
                  disabled={shapeCount === 0}
                  onClick={clearBoardShapes}
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          <Group gap={5} mt="xs">
            <Kbd>Shift</Kbd>
            <Text size="xs" c="dimmed">
              or right-drag to draw
            </Text>
          </Group>
          <Switch
            mt="xs"
            size="xs"
            label="Erase drawables on left-click"
            checked={eraseDrawablesOnClick}
            onChange={(event) => setShouldEraseDrawablesOnClick(event.currentTarget.checked)}
            thumbIcon={eraseDrawablesOnClick ? <IconEraser size="0.65rem" /> : undefined}
          />
        </div>

        <Divider />

        <Group justify="space-between">
          <Text fw={600}>Moves</Text>
          <Text size="xs" c="dimmed">
            SFEN
          </Text>
        </Group>

        <ScrollArea className={classes.moveList} scrollbarSize={6}>
          {moves.length === 0 ? (
            <div className={classes.emptyList}>
              <Text size="sm" c="dimmed">
                Select a 手番 piece on the board to begin.
              </Text>
              <Group gap={5} mt="xs">
                <Kbd>click</Kbd>
                <Text size="xs" c="dimmed">
                  select / move
                </Text>
              </Group>
            </div>
          ) : (
            moves.map((move) => (
              <div key={move.number} className={classes.moveRow}>
                <span>{move.number}</span>
                <strong>{formatMove(move)}</strong>
                <small>{move.drop ? `持駒 → ${move.to}` : `${move.from} → ${move.to}`}</small>
              </div>
            ))
          )}
        </ScrollArea>

        <div className={classes.sfenBox}>
          <Text size="xs" c="dimmed">
            Current SFEN
          </Text>
          <Text size="xs">{sfen}</Text>
        </div>
      </Stack>
    </aside>
  );
}
