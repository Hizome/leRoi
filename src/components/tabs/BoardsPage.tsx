import { ActionIcon, Group, ScrollArea, Tabs } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import BoardAnalysis from "@/components/boards/BoardAnalysis";
import { useShogiGame } from "@/hooks/useShogiGame";
import { BoardTab } from "./BoardTab";
import classes from "./BoardsPage.module.css";

export default function BoardsPage() {
  const game = useShogiGame();

  return (
    <Tabs value="analysis" keepMounted={false} className={classes.tabsContainer}>
      <ScrollArea scrollbarSize={6} className={classes.tabsHeader}>
        <Group gap={0} wrap="nowrap">
          <BoardTab />
          <ActionIcon variant="default" radius={0} className={classes.newTab}>
            <IconPlus />
          </ActionIcon>
          <div className={classes.tabsFiller} />
        </Group>
      </ScrollArea>

      <Tabs.Panel value="analysis" className={classes.panel}>
        <BoardAnalysis game={game} />
      </Tabs.Panel>
    </Tabs>
  );
}
