import { Tooltip as KTooltip, useTooltipContext } from "@kobalte/core/tooltip";
import { type JSX, Show, children, createEffect } from "solid-js";
import { tooltipArrow, tooltipContent } from "~/styles/primitives/tooltip.css";
import { OVERLAY_GUTTER, type OverlaySide } from "~/ui/primitives/_overlay-types";

export interface TooltipProps {
  /** Tooltip text content. Plain string only — tooltips are text-only by ARIA spec. */
  label: string;

  /**
   * Trigger element. Must be a single focusable child. Do not pass a `<Button>`
   * or other interactive element as a wrapper — Kobalte's `Tooltip.Trigger`
   * renders as a native `<button>`; nesting another button creates invalid HTML.
   * Pass strings, icons, or non-interactive elements instead.
   */
  children: JSX.Element;

  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;

  /** Fires after openDelay on open and closeDelay on close. */
  onChange?: (open: boolean) => void;

  /** Suppress the tooltip entirely without unmounting the trigger. */
  disabled?: boolean;

  /**
   * Returns `true` when the tooltip text duplicates the trigger's accessible name.
   * When `true`, applies `label` as `aria-label` on the trigger and renders no
   * surface — used on icon-only buttons to avoid double-announcement.
   */
  asLabel?: boolean;

  /** Placement relative to trigger. Defaults to `"top"`. */
  placement?: OverlaySide;

  /** Open delay in ms. Defaults to 500. */
  openDelay?: number;

  /** Close delay in ms. Defaults to 150. */
  closeDelay?: number;

  /** Pixel gap between trigger and tooltip. Defaults to OVERLAY_GUTTER (6). */
  gutter?: number;

  /** Render an arrow pointing at the trigger. Defaults to false. */
  showArrow?: boolean;
}

/**
 * Inner component rendered inside the Kobalte Tooltip context. Renders the
 * trigger as a transparent `div[display:contents]` to avoid nested-button
 * HTML invalidity when children is already a focusable element. Propagates
 * `aria-describedby`, pointer events, and focus events to the child element
 * directly so keyboard and hover behaviour remain correct.
 */
function TriggerSlot(props: { children: JSX.Element }): JSX.Element {
  const ctx = useTooltipContext();
  const resolved = children(() => props.children);

  createEffect(() => {
    const node = resolved();
    const el = Array.isArray(node) ? node[0] : node;
    if (!(el instanceof Element)) {
      return;
    }

    // sync aria-describedby from the tooltip content id
    const id = ctx.contentId();
    if (id) {
      el.setAttribute("aria-describedby", id);
    } else {
      el.removeAttribute("aria-describedby");
    }
  });

  return (
    <KTooltip.Trigger
      as="div"
      style={{ display: "contents" }}
      // focusin/focusout bubble up from child focusable elements. Call Kobalte's
      // context methods directly so the openDelay is respected on focus (Kobalte
      // normally skips the delay for focus events; this wrapper enforces it).
      onfocusin={() => {
        ctx.openTooltip(false);
      }}
      onfocusout={(e: FocusEvent) => {
        const related = e.relatedTarget as Node | null;
        if (!ctx.isTargetOnTooltip(related)) {
          ctx.hideTooltip(false);
        }
      }}
    >
      {resolved()}
    </KTooltip.Trigger>
  );
}

/**
 * Themed Kobalte Tooltip. Text-only hover/focus hint. When `asLabel` is set,
 * the trigger receives `aria-label={label}` and no surface is rendered — used
 * on icon-only buttons to avoid double-announcement. When `disabled`, children
 * render verbatim with no Kobalte wrapper.
 */
export function Tooltip(props: TooltipProps): JSX.Element {
  if (props.disabled) {
    return <>{props.children}</>;
  }

  if (props.asLabel) {
    const resolved = children(() => props.children);
    createEffect(() => {
      const node = resolved();
      const el = Array.isArray(node) ? node[0] : node;
      if (el instanceof Element) {
        el.setAttribute("aria-label", props.label);
      }
    });
    return <>{resolved()}</>;
  }

  return (
    <KTooltip
      {...(props.open !== undefined ? { open: props.open } : {})}
      {...(props.onChange !== undefined ? { onOpenChange: props.onChange } : {})}
      placement={props.placement ?? "top"}
      openDelay={props.openDelay ?? 500}
      closeDelay={props.closeDelay ?? 150}
      gutter={props.gutter ?? OVERLAY_GUTTER}
    >
      <TriggerSlot>{props.children}</TriggerSlot>
      <KTooltip.Portal>
        <KTooltip.Content class={tooltipContent} data-placement={props.placement ?? "top"}>
          <Show when={props.showArrow}>
            <KTooltip.Arrow class={tooltipArrow} />
          </Show>
          {props.label}
        </KTooltip.Content>
      </KTooltip.Portal>
    </KTooltip>
  );
}
