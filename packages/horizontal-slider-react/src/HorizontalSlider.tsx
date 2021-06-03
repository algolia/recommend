import {
  createHorizontalSliderComponent,
  generateHorizontalSliderId,
  HorizontalSliderProps,
  RecordWithObjectID,
  updateNavigationButtonsProps,
} from '@algolia/ui-components-horizontal-slider-vdom';
import React, { createElement, Fragment, useEffect, useRef } from 'react';

const UncontrolledHorizontalSlider = createHorizontalSliderComponent({
  createElement,
  Fragment,
});

export function HorizontalSlider<TObject extends RecordWithObjectID>(
  props: HorizontalSliderProps<TObject>
) {
  const listRef = useRef<HTMLOListElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const sliderIdRef = useRef(generateHorizontalSliderId());

  useEffect(() => {
    updateNavigationButtonsProps({ listRef, nextButtonRef, previousButtonRef });
  });

  return (
    <UncontrolledHorizontalSlider
      {...props}
      listRef={listRef}
      nextButtonRef={nextButtonRef}
      previousButtonRef={previousButtonRef}
      sliderIdRef={sliderIdRef}
      updateNavigationButtonsProps={() =>
        updateNavigationButtonsProps({
          listRef,
          nextButtonRef,
          previousButtonRef,
        })
      }
    />
  );
}
