import { type ComponentProps, type JSX, splitProps } from "solid-js";
import { IconButton } from "~/ui/primitives/icon-button";

export interface ToggleProps
  extends Omit<ComponentProps<"button">, "type" | "aria-label" | "onClick" | "onChange"> {
  /** Required — toggles have no visible text. */
  "aria-label": string;

  /** Whether the toggle is currently on. Controlled. */
  pressed: boolean;

  /** Called with the next value when the user activates the toggle. */
  onChange: (next: boolean) => void;
}

/**
 * Controlled on/off toggle with `aria-pressed`. Same visual shell as
 * `IconButton`; pass `aria-label` and the controlled `pressed` / `onChange`
 * pair.
 */
export function Toggle(props: ToggleProps): JSX.Element {
  const [local, rest] = splitProps(props, ["pressed", "onChange", "children"]);

  return (
    <IconButton
      {...rest}
      pressed={local.pressed}
      onClick={() => {
        // disabled is honoured by the underlying <button>; the synthetic
        // event still fires on disabled in some browsers, so guard here too.
        if (rest.disabled) {
          return;
        }
        local.onChange(!local.pressed);
      }}
    >
      {local.children}
    </IconButton>
  );
}
