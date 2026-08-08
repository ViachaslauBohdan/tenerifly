"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from "react";

type UseCompactGuestSelectMenuResult = {
  open: boolean;
  mounted: boolean;
  menuStyle: CSSProperties;
  rootRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
  handleToggle: () => void;
  handleClose: () => void;
  handleTriggerKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  closeAndFocusTrigger: () => void;
};

function isMobileViewport() {
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(max-width: 639px)").matches;
  }
  return window.innerWidth < 640;
}

function getMenuStyle(trigger: HTMLElement): CSSProperties {
  const rect = trigger.getBoundingClientRect();

  if (isMobileViewport()) {
    return {
      position: "fixed",
      left: 12,
      right: 12,
      bottom: 12,
      top: "auto",
      width: "auto",
      maxHeight: "min(50vh, 20rem)",
    };
  }

  const maxHeight = 224;
  const spaceBelow = window.innerHeight - rect.bottom - 8;
  const openUp = spaceBelow < maxHeight && rect.top > spaceBelow;

  return {
    position: "fixed",
    left: Math.max(8, rect.left),
    width: Math.max(rect.width, 112),
    maxHeight,
    ...(openUp
      ? { bottom: window.innerHeight - rect.top + 6, top: "auto" }
      : { top: rect.bottom + 6, bottom: "auto" }),
  };
}

/** Scroll only inside the listbox — never call scrollIntoView (portaled nodes live at body end). */
function scrollOptionIntoList(list: HTMLElement, option: HTMLElement) {
  const listRect = list.getBoundingClientRect();
  const optionRect = option.getBoundingClientRect();

  if (optionRect.top < listRect.top) {
    list.scrollTop += optionRect.top - listRect.top;
  } else if (optionRect.bottom > listRect.bottom) {
    list.scrollTop += optionRect.bottom - listRect.bottom;
  }
}

function focusWithoutScroll(element: HTMLElement | null) {
  element?.focus({ preventScroll: true });
}

/** Syncs dropdown open state with viewport geometry and dismiss gestures. */
export function useCompactGuestSelectMenu(): UseCompactGuestSelectMenuResult {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      setMenuStyle(getMenuStyle(trigger));
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const list = listRef.current;
    const selected = list?.querySelector('[aria-selected="true"]');
    if (list && selected instanceof HTMLElement) {
      // offsetTop on the option button is relative to the li; use the li for list scroll.
      const row = selected.closest("li") ?? selected;
      scrollOptionIntoList(list, row instanceof HTMLElement ? row : selected);
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        focusWithoutScroll(triggerRef.current);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleToggle = () => {
    const scrollY = window.scrollY;
    setOpen((current) => !current);
    // Label/focus + portaled menu can nudge window scroll; pin it back.
    requestAnimationFrame(() => {
      if (window.scrollY !== scrollY) {
        window.scrollTo(0, scrollY);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeAndFocusTrigger = () => {
    setOpen(false);
    focusWithoutScroll(triggerRef.current);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      if (!open) {
        event.preventDefault();
        setOpen(true);
      }
    }
  };

  return {
    open,
    mounted,
    menuStyle,
    rootRef,
    triggerRef,
    listRef,
    handleToggle,
    handleClose,
    handleTriggerKeyDown,
    closeAndFocusTrigger,
  };
}
