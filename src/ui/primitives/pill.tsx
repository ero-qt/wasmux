import { type ComponentProps, type JSX, Show, splitProps } from "solid-js";
import { pillDot, pillTone } from "~/styles/primitives/pill.css";

export type PillTone = "neutral" | "accent" | "audio";

export interface PillProps extends ComponentProps<"span"> {
  /** Visual tone. Defaults to `"neutral"`. */
  tone?: PillTone;

  /** Renders a small leading dot in the pill's text colour. */
  dot?: boolean;
}

/** Small rounded label. Optional leading dot. */
export function Pill(props: PillProps): JSX.Element {
  const [local, rest] = splitProps(props, ["tone", "dot", "class", "children"]);
  const cls = (): string => {
    const base = pillTone[local.tone ?? "neutral"];
    return local.class ? `${base} ${local.class}` : base;
  };
  return (
    <span {...rest} class={cls()}>
      <Show when={local.dot}>
        <span aria-hidden="true" class={pillDot} />
      </Show>
      {local.children}
    </span>
  );
}
