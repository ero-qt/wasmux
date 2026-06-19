import {
  type JSX,
  type ParentProps,
  Show,
  createEffect,
  createUniqueId,
  onCleanup,
  splitProps,
} from "solid-js";
import {
  modalBody,
  modalCloseButton,
  modalDescription,
  modalDialog,
  modalHeader,
  modalTitle,
} from "~/styles/primitives/modal.css";

export interface ModalProps extends ParentProps {
  /** Controlled open state. */
  open: boolean;

  /** Fires when the dialog requests to close (Esc, backdrop click, close button). */
  onChange: (open: boolean) => void;

  /** Accessible title; rendered as the dialog heading and wired via aria-labelledby. */
  title: string;

  /** Optional supporting description wired via aria-describedby. */
  description?: string;

  /** Visual size preset; maps to data-size. Defaults to "md". */
  size?: "sm" | "md" | "lg";

  /** When false, suppresses backdrop-click-to-close (Esc still works). Defaults to true. */
  dismissOnBackdrop?: boolean;

  /** Extra class merged onto the dialog element. */
  class?: string;
}

/**
 * Native <dialog> wrapped by a thin Solid component. Drives showModal()/close()
 * via createEffect — never the `open` attribute — so the platform's top-layer
 * focus trap engages. Esc → cancel → onChange(false); backdrop click compares
 * event.target to the dialog element so only the backdrop dismisses.
 */
export function Modal(props: ModalProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "open",
    "onChange",
    "title",
    "description",
    "size",
    "dismissOnBackdrop",
    "children",
    "class",
  ]);

  const titleId = createUniqueId();
  const descId = createUniqueId();

  let dialogEl: HTMLDialogElement | undefined;
  let prevOverflow = "";
  let inertedSiblings: Element[] = [];

  createEffect(() => {
    if (!dialogEl) {
      return;
    }
    if (local.open && !dialogEl.open) {
      prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      inertedSiblings = Array.from(document.body.children).filter(
        (child) => !child.contains(dialogEl),
      );
      for (const el of inertedSiblings) {
        el.setAttribute("inert", "");
      }
      dialogEl.showModal();
    } else if (!local.open && dialogEl.open) {
      dialogEl.close();
      document.documentElement.style.overflow = prevOverflow;
      for (const el of inertedSiblings) {
        el.removeAttribute("inert");
      }
      inertedSiblings = [];
    }
  });

  onCleanup(() => {
    if (dialogEl?.open) {
      dialogEl.close();
    }
    document.documentElement.style.overflow = prevOverflow;
    for (const el of inertedSiblings) {
      el.removeAttribute("inert");
    }
    inertedSiblings = [];
  });

  const dismissBackdrop = (): boolean => local.dismissOnBackdrop !== false;

  const onCancel = (e: Event): void => {
    e.preventDefault();
    local.onChange(false);
  };

  const onBackdropClick = (e: MouseEvent): void => {
    if (!dismissBackdrop()) {
      return;
    }
    if (e.target === dialogEl) {
      local.onChange(false);
    }
  };

  const cls = (): string => (local.class ? `${modalDialog} ${local.class}` : modalDialog);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <dialog> is a native interactive element; keyboard dismissal (Esc) is handled by the cancel event above.
    <dialog
      {...rest}
      ref={dialogEl}
      class={cls()}
      data-size={local.size ?? "md"}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={local.description ? descId : undefined}
      onCancel={onCancel}
      onClick={onBackdropClick}
    >
      <header class={modalHeader}>
        <div>
          <h2 id={titleId} class={modalTitle}>
            {local.title}
          </h2>
          <Show when={local.description}>
            <p id={descId} class={modalDescription}>
              {local.description}
            </p>
          </Show>
        </div>
        <button
          type="button"
          class={modalCloseButton}
          aria-label="Close"
          onClick={() => local.onChange(false)}
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class={modalBody}>{local.children}</div>
    </dialog>
  );
}
