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
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const sliderIdRef = useRef(generateHorizontalSliderId());

  useEffect(() => {
    updateNavigationButtonsProps({ listRef, previousButtonRef, nextButtonRef });
  });

  return (
    <UncontrolledHorizontalSlider
      {...props}
      listRef={listRef}
      previousButtonRef={previousButtonRef}
      nextButtonRef={nextButtonRef}
      sliderIdRef={sliderIdRef}
      updateNavigationButtonsProps={() =>
        updateNavigationButtonsProps({
          listRef,
          previousButtonRef,
          nextButtonRef,
        })
      }
    />
  );
}
