import { Stack, Tooltip } from "@mantine/core";
import {
  type Icon,
  IconBook,
  IconChess,
  IconCpu,
  IconFiles,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "./Sidebar.module.css";

type NavbarLinkProps = {
  icon: Icon;
  label: string;
  active?: boolean;
};

const links = [
  { icon: IconChess, label: "Board", active: true },
  { icon: IconUser, label: "User" },
  { icon: IconFiles, label: "Files" },
  { icon: IconBook, label: "Databases" },
  { icon: IconCpu, label: "Engines" },
];

function NavbarLink({ icon: Icon, label, active }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right">
      <button className={cx(classes.link, { [classes.active]: active })} aria-label={label}>
        <Icon size="1.5rem" stroke={1.5} />
      </button>
    </Tooltip>
  );
}

export function SideBar() {
  return (
    <Stack justify="space-between" h="100%" gap={0}>
      <Stack gap={0}>
        {links.map((link) => (
          <NavbarLink key={link.label} {...link} />
        ))}
      </Stack>
      <NavbarLink icon={IconSettings} label="Settings" />
    </Stack>
  );
}
