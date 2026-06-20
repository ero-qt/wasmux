import { Tooltip as KTooltip } from "@kobalte/core/tooltip";
import {
  type JSX,
  Show,
  children,
  createEffect,
  createSignal,
  onMount,
  splitProps,
} from "solid-js";
import { tooltipArrow, tooltipContent } from "~/styles/primitives/tooltip.css";
import { OVERLAY_GUTTER, type OverlaySide } from "~/ui/primitives/_overlay-types";

export interface TooltipProps {
  /** Tooltip text content. Plain string only — tooltips are text-only by ARIA spec. */
  label: string;

  /**
   * The element the tooltip is anchored to. Can be any inline element —
   * including a Button or IconButton — because the trigger is wrapped in
   * a `display: contents` div, so Kobalte does not introduce a nested button.
   */
  children: JSX.Element;

  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;

  /** Fires after openDelay on hover-open, immediately on focus-open, and after closeDelay on close. */
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

  /** Hover open delay in ms. Focus always opens immediately per WCAG. Defaults to 500. */
  openDelay?: number;

  /** Close delay in ms. Defaults to 150. */
  closeDelay?: number;

  /** Pixel gap between trigger and tooltip. Defaults to OVERLAY_GUTTER (6). */
  gutter?: number;

  /** Render an arrow pointing at the trigger. Defaults to false. */
  showArrow?: boolean;
}

/**
 * Themed Kobalte Tooltip. Text-only hover/focus hint. When `asLabel` is set,
 * the trigger receives `aria-label={label}` and no surface is rendered — used
 * on icon-only buttons to avoid double-announcement. When `disabled`, children
 * render verbatim with no Kobalte wrapper.
 */
export function Tooltip(props: TooltipProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "label",
    "children",
    "open",
    "onChange",
    "disabled",
    "asLabel",
    "placement",
    "openDelay",
    "closeDelay",
    "gutter",
    "showArrow",
  ]);

  if (local.disabled) {
    return <>{local.children}</>;
  }

  if (local.asLabel) {
    const resolved = children(() => local.children);
    createEffect(() => {
      const node = resolved();
      const el = Array.isArray(node) ? node[0] : node;
      if (el instanceof Element) {
        el.setAttribute("aria-label", local.label);
      }
    });
    return <>{resolved()}</>;
  }

  let triggerRef: HTMLSpanElement | undefined;

  // portal into the ancestor <dialog> when one exists so the overlay renders
  // inside the top-layer instead of below it. falls back to document.body
  // (the default) when no dialog ancestor is found.
  // onMount defers the lookup until after the trigger is inserted into the DOM
  // — closest() returns null if queried while the element is still detached.
  const [portalMount, setPortalMount] = createSignal<Node>(document.body);
  onMount(() => {
    const dialog = triggerRef?.closest("dialog");
    if (dialog) {
      setPortalMount(dialog);
    }
  });

  return (
    <KTooltip
      {...(local.open !== undefined ? { open: local.open } : {})}
      {...(local.onChange !== undefined ? { onOpenChange: local.onChange } : {})}
      placement={local.placement ?? "top"}
      openDelay={local.openDelay ?? 500}
      closeDelay={local.closeDelay ?? 150}
      gutter={local.gutter ?? OVERLAY_GUTTER}
    >
      <KTooltip.Trigger as="span" ref={triggerRef} {...rest}>
        {local.children}
      </KTooltip.Trigger>
      <KTooltip.Portal mount={portalMount()}>
        <KTooltip.Content class={tooltipContent} data-placement={local.placement ?? "top"}>
          <Show when={local.showArrow}>
            <KTooltip.Arrow class={tooltipArrow} />
          </Show>
          {local.label}
        </KTooltip.Content>
      </KTooltip.Portal>
    </KTooltip>
  );
}
