type Ref<TElement> = {
  current: TElement;
};

export type FrameworkProps = {
  listRef: Ref<HTMLOListElement | null>;
  nextButtonRef: Ref<HTMLButtonElement | null>;
  previousButtonRef: Ref<HTMLButtonElement | null>;
  sliderIdRef: Ref<string>;
  updateNavigationButtonsProps(): void;
};
