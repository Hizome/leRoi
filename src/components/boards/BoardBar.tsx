import { Badge, Group, Text } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import cx from "clsx";
import type { Color } from "shogiops/types";
import type { Position } from "shogiops/variant/position";
import { colorName } from "@/utils/shogi";
import classes from "./BoardBar.module.css";

type BoardBarProps = {
  color: Color;
  position: Position;
  top?: boolean;
};

export function BoardBar({ color, position, top }: BoardBarProps) {
  const isTurn = position.turn === color;

  return (
    <div className={cx(classes.playerStrip, { [classes.top]: top })}>
      <Group gap="xs">
        <IconClock size="1rem" />
        <Text size="sm">{color === "sente" ? "Sente" : "Gote"}</Text>
        <Badge color={isTurn ? "cyan" : undefined} variant={isTurn ? "light" : "default"}>
          {isTurn ? `手番 ${colorName(color)}` : "持ち時間 10:00"}
        </Badge>
      </Group>
    </div>
  );
}
