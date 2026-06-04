import { Group, Text } from "@mantine/core";
import type { Color } from "shogiops/types";
import type { Position } from "shogiops/variant/position";
import { handRoles } from "shogiops/variant/util";
import { roleLabel } from "@/utils/shogi";
import classes from "./HandRow.module.css";

export function HandRow({ color, position }: { color: Color; position: Position }) {
  const hand = position.hands.color(color);
  const entries = handRoles("standard")
    .map((role) => [role, hand.get(role)] as const)
    .filter(([, count]) => count > 0);

  if (entries.length === 0) {
    return (
      <Text size="xs" c="dimmed">
        持駒なし
      </Text>
    );
  }

  return (
    <Group gap={4} className={classes.handRow}>
      {entries.map(([role, count]) => (
        <span key={role}>
          {roleLabel[role]} {count > 1 ? count : ""}
        </span>
      ))}
    </Group>
  );
}
