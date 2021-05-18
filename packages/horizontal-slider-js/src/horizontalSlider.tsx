import {
  HorizontalSlider as HorizontalSliderOriginal,
  HorizontalSliderProps,
} from '@algolia/ui-components-horizontal-slider-react';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';

type RecordWithObjectID<TObject = {}> = TObject & {
  objectID: string;
};

export function HorizontalSlider<TObject extends RecordWithObjectID>(
  props: HorizontalSliderProps<TObject>
) {
  return <HorizontalSliderOriginal {...props} />;
}

type EnvironmentProps = {
  container: string | HTMLElement;
  environment?: typeof window;
};

export function horizontalSlider<TObject extends RecordWithObjectID>({
  container,
  environment,
  ...rest
}: HorizontalSliderProps<TObject> & EnvironmentProps) {
  render(
    <HorizontalSlider {...rest} />,
    getHTMLElement(container, environment)
  );
}
