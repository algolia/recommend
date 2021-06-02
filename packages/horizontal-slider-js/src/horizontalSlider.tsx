/** @jsx h */
import {
  createHorizontalSliderComponent,
  generateHorizontalSliderId,
  HorizontalSliderProps,
  RecordWithObjectID,
  updateNavigationButtonsProps,
} from '@algolia/ui-components-horizontal-slider-vdom';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';

const UncontrolledHorizontalSlider = createHorizontalSliderComponent({
  createElement,
  Fragment,
});

function HorizontalSlider<TObject extends RecordWithObjectID>(
  props: HorizontalSliderProps<TObject>
) {
  const listRef = useRef<HTMLOListElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const sliderIdRef = useRef(generateHorizontalSliderId());

  useEffect(() => {
    updateNavigationButtonsProps({
      listRef,
      previousButtonRef,
      nextButtonRef,
    });
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

export function horizontalSlider<TObject extends RecordWithObjectID>({
  container,
  environment = window,
  ...props
}: HorizontalSliderProps<TObject> & EnvironmentProps) {
  const children = <HorizontalSlider {...props} />;

  if (!container) {
    return children;
  }

  render(children, getHTMLElement(container, environment));

  return undefined;
}
