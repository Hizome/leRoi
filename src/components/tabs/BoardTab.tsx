import { ActionIcon, Button } from "@mantine/core";
import { IconAnalyze, IconX } from "@tabler/icons-react";
import cx from "clsx";
import classes from "./BoardTab.module.css";

export function BoardTab() {
  return (
    <Button
      component="div"
      className={cx(classes.tab, classes.selected)}
      variant="default"
      fw="normal"
      radius={0}
      leftSection={<IconAnalyze size="0.9rem" />}
      rightSection={
        <ActionIcon component="div" className={classes.closeTabBtn} size="0.875rem">
          <IconX />
        </ActionIcon>
      }
    >
      <span className={classes.label}>将棋分析</span>
    </Button>
  );
}
