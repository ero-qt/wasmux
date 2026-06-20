import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { type JSX, Show, createSignal, onMount, splitProps } from "solid-js";
import {
  menuContent,
  menuGroup,
  menuItem,
  menuItemGlyphSlot,
  menuItemHotkey,
  menuItemIndicatorSlot,
  menuItemLabel,
  menuLabel,
  menuSeparator,
  menuSubTriggerChevron,
} from "~/styles/primitives/menu.css";
import { OVERLAY_GUTTER } from "~/ui/primitives/_overlay-types";
import { Keycap } from "~/ui/primitives/keycap";

export type MenuPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface MenuProps {
  /**
   * Trigger content (button label/icon). Pass a string, icon, or other inline
   * content — NOT a button. Kobalte's `DropdownMenu.Trigger` renders as a native
   * `<button>`; nesting another button creates invalid HTML and an a11y failure.
   */
  trigger: JSX.Element;

  /** Menu items, separators, groups, and sub-menus. */
  children: JSX.Element;

  /** Placement relative to the trigger. Defaults to `bottom-start`. */
  placement?: MenuPlacement;

  /** Pixel gap between trigger and content. Defaults to OVERLAY_GUTTER (6). */
  gutter?: number;

  /** Disables the trigger; prevents the menu from opening. */
  disabled?: boolean;

  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;

  /** Fires when open state changes. */
  onChange?: (next: boolean) => void;

  /**
   * Accessible label for the menu surface. Pass ONLY for icon-only triggers
   * — text triggers (e.g. `trigger="Edit"`) already provide the name via
   * Kobalte's `aria-labelledby`. Passing `aria-label` for a text trigger
   * overrides the natural name with the supplied string (ARIA 1.2 §6.2:
   * aria-label wins over aria-labelledby).
   */
  "aria-label"?: string;

  /** Class applied to the trigger button. */
  triggerClass?: string;
}

export interface MenuItemProps {
  /** Called when the item is activated (click / Enter / Space). */
  onSelect?: () => void;

  /** Disabled state. */
  disabled?: boolean;

  /** Optional leading glyph (icon/emoji). Slot is always reserved for alignment. */
  glyph?: JSX.Element;

  /** Optional trailing hotkey hint. Rendered aria-hidden so it does not pollute typeahead. */
  hotkey?: string;

  /** Item label. */
  children: JSX.Element;
}

export interface MenuCheckboxItemProps {
  /** Controlled checked state. */
  checked: boolean;

  /** Called with the new checked state. */
  onChange: (next: boolean) => void;

  /** Disabled state. */
  disabled?: boolean;

  /** Optional trailing hotkey hint. */
  hotkey?: string;

  /** Item label. */
  children: JSX.Element;
}

export interface MenuRadioGroupProps<T extends string> {
  /** Controlled selected value. */
  value: T;

  /** Called with the new selected value. */
  onChange: (next: T) => void;

  /** Radio items. */
  children: JSX.Element;
}

export interface MenuRadioItemProps<T extends string> {
  /** The value this item represents. */
  value: T;

  /** Disabled state. */
  disabled?: boolean;

  /** Optional trailing hotkey hint. */
  hotkey?: string;

  /** Item label. */
  children: JSX.Element;
}

export interface MenuSeparatorProps {
  /** Optional accessible label. */
  "aria-label"?: string;
}

export interface MenuLabelProps {
  /** Non-interactive group heading text. */
  children: JSX.Element;
}

export interface MenuSubProps {
  /** Sub-trigger label content. */
  trigger: JSX.Element;

  /** Optional leading glyph on the sub-trigger. */
  glyph?: JSX.Element;

  /** Disabled state. */
  disabled?: boolean;

  /** Sub-menu items. */
  children: JSX.Element;
}

function Hotkey(props: { hotkey?: string }): JSX.Element {
  return (
    <Show when={props.hotkey}>
      <span class={menuItemHotkey} aria-hidden="true">
        <Keycap>{props.hotkey}</Keycap>
      </span>
    </Show>
  );
}

function MenuItem(props: MenuItemProps): JSX.Element {
  return (
    <DropdownMenu.Item
      class={menuItem}
      {...(props.disabled ? { disabled: true } : {})}
      {...(props.hotkey ? { "aria-keyshortcuts": props.hotkey } : {})}
      onSelect={() => props.onSelect?.()}
    >
      <span class={menuItemIndicatorSlot} />
      <span class={menuItemGlyphSlot} aria-hidden="true">
        {props.glyph}
      </span>
      <span class={menuItemLabel}>{props.children}</span>
      <Hotkey {...(props.hotkey ? { hotkey: props.hotkey } : {})} />
    </DropdownMenu.Item>
  );
}

function MenuCheckboxItem(props: MenuCheckboxItemProps): JSX.Element {
  return (
    <DropdownMenu.CheckboxItem
      class={menuItem}
      checked={props.checked}
      onChange={props.onChange}
      {...(props.disabled ? { disabled: true } : {})}
      {...(props.hotkey ? { "aria-keyshortcuts": props.hotkey } : {})}
    >
      <span class={menuItemIndicatorSlot}>
        <DropdownMenu.ItemIndicator>
          <span aria-hidden="true">✓</span>
        </DropdownMenu.ItemIndicator>
      </span>
      <span class={menuItemGlyphSlot} />
      <span class={menuItemLabel}>{props.children}</span>
      <Hotkey {...(props.hotkey ? { hotkey: props.hotkey } : {})} />
    </DropdownMenu.CheckboxItem>
  );
}

function MenuRadioGroup<T extends string>(props: MenuRadioGroupProps<T>): JSX.Element {
  return (
    <DropdownMenu.RadioGroup
      class={menuGroup}
      value={props.value}
      onChange={(v) => props.onChange(v as T)}
    >
      {props.children}
    </DropdownMenu.RadioGroup>
  );
}

function MenuRadioItem<T extends string>(props: MenuRadioItemProps<T>): JSX.Element {
  return (
    <DropdownMenu.RadioItem
      class={menuItem}
      value={props.value}
      {...(props.disabled ? { disabled: true } : {})}
      {...(props.hotkey ? { "aria-keyshortcuts": props.hotkey } : {})}
    >
      <span class={menuItemIndicatorSlot}>
        <DropdownMenu.ItemIndicator>
          <span aria-hidden="true">●</span>
        </DropdownMenu.ItemIndicator>
      </span>
      <span class={menuItemGlyphSlot} />
      <span class={menuItemLabel}>{props.children}</span>
      <Hotkey {...(props.hotkey ? { hotkey: props.hotkey } : {})} />
    </DropdownMenu.RadioItem>
  );
}

function MenuSeparator(props: MenuSeparatorProps): JSX.Element {
  return <DropdownMenu.Separator class={menuSeparator} aria-label={props["aria-label"]} />;
}

function MenuLabel(props: MenuLabelProps): JSX.Element {
  return (
    <DropdownMenu.Group class={menuGroup}>
      <DropdownMenu.GroupLabel class={menuLabel}>{props.children}</DropdownMenu.GroupLabel>
    </DropdownMenu.Group>
  );
}

function MenuSub(props: MenuSubProps): JSX.Element {
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger class={menuItem} {...(props.disabled ? { disabled: true } : {})}>
        <span class={menuItemIndicatorSlot} />
        <span class={menuItemGlyphSlot}>{props.glyph}</span>
        <span class={menuItemLabel}>{props.trigger}</span>
        <span class={menuSubTriggerChevron} aria-hidden="true">
          ▸
        </span>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent class={menuContent}>{props.children}</DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
}

/**
 * Themed Kobalte DropdownMenu. Compound surface: `Menu`, `Menu.Item`,
 * `Menu.CheckboxItem`, `Menu.RadioGroup`, `Menu.RadioItem`, `Menu.Separator`,
 * `Menu.Label`, `Menu.Sub`. Each row lays out as
 * `indicator | glyph | label | hotkey` — the indicator slot is reserved
 * unconditionally so labels align across plain / checkbox / radio items.
 */
export function Menu(props: MenuProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "trigger",
    "children",
    "placement",
    "gutter",
    "disabled",
    "open",
    "onChange",
    "aria-label",
    "triggerClass",
  ]);

  let triggerRef: HTMLButtonElement | undefined;

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
    <DropdownMenu
      placement={local.placement ?? "bottom-start"}
      gutter={local.gutter ?? OVERLAY_GUTTER}
      {...(local.open !== undefined ? { open: local.open } : {})}
      {...(local.onChange !== undefined
        ? { onOpenChange: (o: boolean) => local.onChange?.(o) }
        : {})}
    >
      <DropdownMenu.Trigger
        {...rest}
        ref={triggerRef}
        class={local.triggerClass}
        disabled={local.disabled}
      >
        {local.trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal mount={portalMount()}>
        <DropdownMenu.Content
          class={menuContent}
          aria-label={local["aria-label"]}
          data-placement={local.placement ?? "bottom-start"}
        >
          {local.children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}

Menu.Item = MenuItem;
Menu.CheckboxItem = MenuCheckboxItem;
Menu.RadioGroup = MenuRadioGroup;
Menu.RadioItem = MenuRadioItem;
Menu.Separator = MenuSeparator;
Menu.Label = MenuLabel;
Menu.Sub = MenuSub;
