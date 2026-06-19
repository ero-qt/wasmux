import { type ComponentProps, type JSX, splitProps } from "solid-js";
import { keycap } from "~/styles/primitives/keycap.css";

export interface KeycapProps extends ComponentProps<"kbd"> {}

/** Display-only kbd badge for hotkey hints. */
export function Keycap(props: KeycapProps): JSX.Element {
  const [local, rest] = splitProps(props, ["class", "children"]);
  const cls = (): string => (local.class ? `${keycap} ${local.class}` : keycap);
  return (
    <kbd {...rest} class={cls()}>
      {local.children}
    </kbd>
  );
}
