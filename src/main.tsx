import "@mantine/core/styles.css";
import "@/styles/global.css";

import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { theme } from "@/styles/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
);
