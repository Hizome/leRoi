/// <reference types="vite/client" />

import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ShogiElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      coord: ShogiElementProps;
      coords: ShogiElementProps;
      piece: ShogiElementProps;
      sq: ShogiElementProps;
      "sg-board": ShogiElementProps;
      "sg-empty-hand": ShogiElementProps;
      "sg-hand": ShogiElementProps;
      "sg-hand-wrap": ShogiElementProps;
      "sg-hp-wrap": ShogiElementProps;
      "sg-pieces": ShogiElementProps;
      "sg-promotion": ShogiElementProps;
      "sg-promotion-choices": ShogiElementProps;
      "sg-promotion-square": ShogiElementProps;
      "sg-squares": ShogiElementProps;
    }
  }
}
