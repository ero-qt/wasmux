import { Tooltip as KTooltip } from "@kobalte/core/tooltip";
import { type JSX, Show, children, createMemo, createSignal, onMount, splitProps } from "solid-js";
import { tooltipArrow, tooltipContent, tooltipInner } from "~/styles/primitives/tooltip.css";
import { OVERLAY_GUTTER, type OverlaySide } from "~/ui/primitives/_overlay-types";
import { Keycap } from "~/ui/primitives/keycap";

export interface TooltipProps {
  /**
   * Plain-text descriptive message. Suppressed automatically when it equals
   * the trigger's own text content (case- and whitespace-insensitive) —
   * the trigger's name already conveys the same information. If `hotkey` is
   * also set in that case, the surface still renders showing only the key
   * combination.
   */
  message?: string;

  /**
   * Key combination hint rendered as a `Keycap` badge (e.g. `"Ctrl+S"`,
   * `"Space"`). When `message` is suppressed via the redundancy rule and
   * `hotkey` is present, the surface shows the key combination alone — no
   * parens, no redundant label. Phase 9 will wire real bindings; until then
   * this is a visual hint only.
   */
  hotkey?: string;

  /**
   * The element the tooltip is anchored to. Can be any inline element —
   * including a Button or IconButton — because the trigger is wrapped in a
   * `<span>` so Kobalte does not introduce a nested button.
   */
  children: JSX.Element;

  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;

  /** Fires after openDelay on hover-open, immediately on focus-open, and after closeDelay on close. */
  onChange?: (open: boolean) => void;

  /** Suppress the tooltip entirely without unmounting the trigger. */
  disabled?: boolean;

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

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function nodeText(value: unknown): string {
  if (value == null) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(nodeText).join(" ");
  }
  if (value instanceof Node) {
    return value.textContent ?? "";
  }
  return "";
}

/**
 * Themed Kobalte Tooltip. Hover/focus hint composed of a message and/or a
 * key combination. Suppression rules:
 *
 * - `disabled` — children render verbatim, no wrapper.
 * - `message` equals the trigger's text content AND no `hotkey` — children
 *   render verbatim. The message would only restate the button's own name.
 * - `message` equals the trigger's text content AND `hotkey` set — surface
 *   shows the key combination only.
 * - neither `message` nor `hotkey` — children render verbatim.
 *
 * Kobalte wires the surface via `aria-describedby`, so it complements the
 * trigger's accessible name rather than replacing it.
 */
export function Tooltip(props: TooltipProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "message",
    "hotkey",
    "children",
    "open",
    "onChange",
    "disabled",
    "placement",
    "openDelay",
    "closeDelay",
    "gutter",
    "showArrow",
  ]);

  if (local.disabled) {
    return <>{local.children}</>;
  }

  const resolved = children(() => local.children);
  const triggerText = createMemo(() => normalize(nodeText(resolved())));
  const messageRedundant = createMemo(
    () => !!local.message && normalize(local.message) === triggerText(),
  );
  const showMessage = createMemo(() => !!local.message && !messageRedundant());
  const hasSurface = createMemo(() => showMessage() || !!local.hotkey);

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
    <Show when={hasSurface()} fallback={resolved()}>
      <KTooltip
        {...(local.open !== undefined ? { open: local.open } : {})}
        {...(local.onChange !== undefined ? { onOpenChange: local.onChange } : {})}
        placement={local.placement ?? "top"}
        openDelay={local.openDelay ?? 500}
        closeDelay={local.closeDelay ?? 150}
        gutter={local.gutter ?? OVERLAY_GUTTER}
      >
        <KTooltip.Trigger as="span" ref={triggerRef} {...rest}>
          {resolved()}
        </KTooltip.Trigger>
        <KTooltip.Portal mount={portalMount()}>
          <KTooltip.Content class={tooltipContent} data-placement={local.placement ?? "top"}>
            <Show when={local.showArrow}>
              <KTooltip.Arrow class={tooltipArrow} />
            </Show>
            <span class={tooltipInner}>
              <Show when={showMessage()}>
                <span>{local.message}</span>
              </Show>
              <Show when={local.hotkey}>
                <Keycap>{local.hotkey}</Keycap>
              </Show>
            </span>
          </KTooltip.Content>
        </KTooltip.Portal>
      </KTooltip>
    </Show>
  );
}
