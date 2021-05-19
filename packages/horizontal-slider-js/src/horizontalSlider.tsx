import {
  HorizontalSlider,
  HorizontalSliderProps,
} from '@algolia/ui-components-horizontal-slider-react/src';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';

type RecordWithObjectID<TObject = {}> = TObject & {
  objectID: string;
};

type EnvironmentProps = {
  container: string | HTMLElement;
  environment?: typeof window;
};

export function horizontalSlider<TObject extends RecordWithObjectID>({
  container,
  environment = window,
  ...rest
}: HorizontalSliderProps<TObject> & EnvironmentProps) {
  render(
    <HorizontalSlider {...rest} />,
    getHTMLElement(container, environment)
  );
}
