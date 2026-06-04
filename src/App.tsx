import { AppShell } from "@mantine/core";
import { SideBar } from "@/components/Sidebar";
import BoardsPage from "@/components/tabs/BoardsPage";
import classes from "./App.module.css";

export default function App() {
  return (
    <AppShell navbar={{ width: 48, breakpoint: 0 }} padding={0}>
      <AppShell.Navbar className={classes.sidebar}>
        <SideBar />
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        <BoardsPage />
      </AppShell.Main>
    </AppShell>
  );
}
