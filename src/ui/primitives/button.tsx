import { type ComponentProps, type JSX, splitProps } from "solid-js";
import { buttonVariant } from "~/styles/primitives/button.css";

export type ButtonVariant = "accent" | "ghost" | "icon";

export interface ButtonProps extends Omit<ComponentProps<"button">, "type"> {
  /** Visual variant. Defaults to `"accent"`. */
  variant?: ButtonVariant;

  /** Native button `type`. Defaults to `"button"` (NOT `"submit"`). */
  type?: "button" | "submit" | "reset";
}

/**
 * Base button primitive. Use the `variant` prop to pick a visual; pass the
 * usual `<button>` attributes (`onClick`, `disabled`, `aria-*`, etc.) through.
 * For toggleable visuals, prefer the higher-level Toggle / IconButton.
 */
export function Button(props: ButtonProps): JSX.Element {
  const [local, rest] = splitProps(props, ["variant", "type", "class", "children"]);

  const variant = (): ButtonVariant => local.variant ?? "accent";
  const cls = (): string => {
    const base = buttonVariant[variant()];
    return local.class ? `${base} ${local.class}` : base;
  };

  return (
    <button {...rest} type={local.type ?? "button"} class={cls()}>
      {local.children}
    </button>
  );
}

/** Returns the class string for a given variant without rendering. */
export function buttonClass(variant: ButtonVariant): string {
  return buttonVariant[variant];
}
