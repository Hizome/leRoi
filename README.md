# leRoi

leRoi is a Shogi desktop app prototype inspired by the en-croissant interface and powered by lishogi's Shogi board stack.

The current build uses React, Vite, Mantine, Tauri 2, `shogiground`, and `shogiops`.

## Current Scope

- en-croissant-inspired application shell and board workspace
- Shogiground-driven Shogi board rendering
- Static board and piece assets copied into the project for future themes
- Dynamic hands, legal move/drop highlights, drag-and-drop, promotion dialog, and move animation
- lishogi-style move and capture sounds
- Tauri scaffold for desktop packaging

## Tech Stack

- React 19
- Vite 8
- Mantine 8
- Tauri 2
- TypeScript
- shogiground 0.10.3
- shogiops 0.21
- pnpm

## Project Structure

```text
leRoi/
  public/
    assets/
      boards/                 Static Shogi board themes
      pieces/standard/        Static Shogi piece themes
      sound/                  Move and capture sounds
  src/
    components/
      boards/                 Board workspace, Shogiground wrapper, controls
      tabs/                   Board tab UI
    hooks/                    Shogi game state
    styles/                   Mantine theme and global CSS
    types/                    Shared TypeScript types
    utils/                    Shogi asset helpers and sound helpers
  src-tauri/                  Tauri desktop shell
```

## Development

Install dependencies:

```bash
pnpm install
```

Run the web frontend:

```bash
pnpm start-vite
```

The app runs at:

```text
http://127.0.0.1:1420/
```

Run the Tauri desktop app:

```bash
pnpm dev
```

Build the frontend:

```bash
pnpm build-vite
```

Build the Tauri app without bundling installers:

```bash
pnpm build
```

## Board Implementation

The board is rendered through `shogiground`, matching lishogi's board model:

- `sfen.board` and `sfen.hands` drive board and hand state
- `movable.dests` comes from `shogiops/compat`
- `droppable.dests` comes from `shogiops/compat`
- promotion rules come from `shogiops/variant/util`
- Shogiground owns piece DOM, hands, dragging, move animation, and promotion UI

React owns the outer app shell and the current game state.

## Language Direction

The UI language direction is English first, with Shogi-specific terms kept in Japanese where that gives the app the right domain feel.

Current fixed Japanese terms include:

- `将棋`
- `先手`
- `後手`
- `手番`
- `持駒`
- piece names such as `歩`, `香`, `桂`, `銀`, `金`, `玉`, `角`, `飛`
- move markers such as `打` and `成`

Future localization should support English and Japanese while keeping these terms available as stable glossary entries.

## Static Assets

Board, piece, and sound assets are stored under `public/assets` so they can be themed and packaged with the desktop app.

The current Shogi move sounds use lishogi's default `system/shogi` set:

- `move`
- `capture`

Both `ogg` and `mp3` files are included.

## Notes

This project intentionally keeps generated outputs out of Git:

- `node_modules/`
- `dist/`
- `src-tauri/target/`
- logs, temporary files, and coverage reports

Lockfiles are kept in Git:

- `pnpm-lock.yaml`
- `src-tauri/Cargo.lock`
