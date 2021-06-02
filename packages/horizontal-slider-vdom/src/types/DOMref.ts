type Ref<TElement> = {
  current: TElement;
};

export type DOMref = {
  listRef: Ref<HTMLOListElement | null>;
  previousButtonRef: Ref<HTMLButtonElement | null>;
  nextButtonRef: Ref<HTMLButtonElement | null>;
  sliderIdRef: Ref<string>;
  updateNavigationButtonsProps(): void;
};
