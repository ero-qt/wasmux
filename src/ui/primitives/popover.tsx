import { Popover as KPopover } from "@kobalte/core/popover";
import { type JSX, Show, splitProps } from "solid-js";
import { popoverArrow, popoverContent } from "~/styles/primitives/popover.css";
import { OVERLAY_GUTTER, type OverlaySide } from "~/ui/primitives/_overlay-types";

export type PopoverSide = OverlaySide;

export interface PopoverProps {
  /** Controlled open state. */
  open: boolean;

  /** Fires when the popover requests to open or close. */
  onChange: (next: boolean) => void;

  /**
   * Content shown inside the trigger button. Pass a string, icon, or other
   * inline content — NOT a button or other interactive element. Kobalte's
   * `Popover.Trigger` renders as a native `<button>`; passing another button
   * creates nested interactive elements (invalid HTML and an a11y failure).
   */
  trigger: JSX.Element;

  /** Floating panel contents. */
  children: JSX.Element;

  /** Preferred placement relative to the trigger. Default "bottom". */
  placement?: PopoverSide;

  /** Distance in px between trigger and panel. Default OVERLAY_GUTTER (6). */
  gutter?: number;

  /** Disables the trigger; prevents opening. */
  disabled?: boolean;

  /** Renders a small arrow pointing at the trigger. Default false. */
  showArrow?: boolean;

  /** Required accessible label when the panel has no visible heading. */
  "aria-label"?: string;

  /** Id of a visible heading inside the panel; use instead of `aria-label`. */
  "aria-labelledby"?: string;
}

/**
 * Themed Kobalte Popover. Non-modal floating surface anchored to a trigger.
 * Wraps Kobalte's Trigger/Portal/Content into a flat `trigger` + `children`
 * surface; ARIA wiring, focus return, Escape, and outside-click come from
 * Kobalte's focus scope.
 */
export function Popover(props: PopoverProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "open",
    "onChange",
    "trigger",
    "children",
    "placement",
    "gutter",
    "disabled",
    "showArrow",
    "aria-label",
    "aria-labelledby",
  ]);

  return (
    <KPopover
      open={local.open}
      onOpenChange={local.onChange}
      placement={local.placement ?? "bottom"}
      gutter={local.gutter ?? OVERLAY_GUTTER}
    >
      <KPopover.Trigger {...rest} disabled={local.disabled}>
        {local.trigger}
      </KPopover.Trigger>
      <KPopover.Portal>
        <KPopover.Content
          class={popoverContent}
          aria-label={local["aria-label"]}
          aria-labelledby={local["aria-labelledby"]}
          data-placement={local.placement ?? "bottom"}
        >
          <Show when={local.showArrow}>
            <KPopover.Arrow class={popoverArrow} />
          </Show>
          {local.children}
        </KPopover.Content>
      </KPopover.Portal>
    </KPopover>
  );
}
