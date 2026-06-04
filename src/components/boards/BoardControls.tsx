import { ActionIcon, Group, SegmentedControl, Tooltip } from "@mantine/core";
import { IconDeviceFloppy, IconFolderOpen, IconRefresh } from "@tabler/icons-react";
import type { Color } from "shogiops/types";
import classes from "./BoardControls.module.css";

type BoardControlsProps = {
  orientation: Color;
  resetBoard: () => void;
  setBoardOrientation: (value: Color) => void;
};

export function BoardControls({
  orientation,
  resetBoard,
  setBoardOrientation,
}: BoardControlsProps) {
  return (
    <div className={classes.toolbar}>
      <Group gap="xs">
        <Tooltip label="New game">
          <ActionIcon variant="default" radius={0} onClick={resetBoard}>
            <IconRefresh size="1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Open file">
          <ActionIcon variant="default" radius={0}>
            <IconFolderOpen size="1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Save">
          <ActionIcon variant="default" radius={0}>
            <IconDeviceFloppy size="1rem" />
          </ActionIcon>
        </Tooltip>
      </Group>
      <SegmentedControl
        size="xs"
        radius={0}
        value={orientation}
        onChange={(value) => setBoardOrientation(value as Color)}
        data={[
          { value: "sente", label: "先手" },
          { value: "gote", label: "後手" },
        ]}
      />
    </div>
  );
}
