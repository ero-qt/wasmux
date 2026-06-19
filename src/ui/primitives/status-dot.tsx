import { type ComponentProps, type JSX, splitProps } from "solid-js";
import { statusDotTone, statusDotpulse } from "~/styles/primitives/status-dot.css";

export type StatusDotTone = "neutral" | "accent" | "audio";

export interface StatusDotProps extends ComponentProps<"span"> {
  /** Visual tone. Defaults to `"neutral"`. */
  tone?: StatusDotTone;

  /** Pulses every 2.6s — disabled under `prefers-reduced-motion: reduce`. */
  pulse?: boolean;
}

/**
 * Bare status indicator dot. Hidden from the a11y tree by default; set
 * `aria-label` for live-status announcements (the parent should also carry
 * `role="status"` or `aria-live="polite"`).
 */
export function StatusDot(props: StatusDotProps): JSX.Element {
  const [local, rest] = splitProps(props, ["tone", "pulse", "class"]);
  const cls = (): string => {
    const base = statusDotTone[local.tone ?? "neutral"];
    const withPulse = local.pulse ? `${base} ${statusDotpulse}` : base;
    return local.class ? `${withPulse} ${local.class}` : withPulse;
  };
  return (
    <span
      {...rest}
      class={cls()}
      aria-hidden={rest["aria-label"] === undefined ? "true" : undefined}
    />
  );
}
