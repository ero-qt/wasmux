import { type ComponentProps, type JSX, splitProps } from "solid-js";
import { Button } from "~/ui/primitives/button";

export interface IconButtonProps extends Omit<ComponentProps<"button">, "type" | "aria-label"> {
  /** Required — icon-only controls have no visible text. */
  "aria-label": string;

  /** Reflects toggled-on state via `aria-pressed`. Omit for plain action buttons. */
  pressed?: boolean;
}

/**
 * Square icon button — 1.75rem default, sized by `--ui-density`. Always
 * requires `aria-label`. Pass `pressed` for toggle visuals (`aria-pressed`
 * is wired into the icon-variant styles via attribute selector).
 */
export function IconButton(props: IconButtonProps): JSX.Element {
  const [local, rest] = splitProps(props, ["pressed", "children"]);
  return (
    <Button
      {...rest}
      variant="icon"
      aria-pressed={local.pressed === undefined ? undefined : local.pressed}
    >
      {local.children}
    </Button>
  );
}
