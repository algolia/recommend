import {
  ProductBaseRecord,
  RelatedProductsSlider,
  RelatedProductsProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';
import { RenderProps } from './types';

export function relatedProductsSlider<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: RelatedProductsProps<TObject> & RenderProps) {
  render(
    <RelatedProductsSlider {...rest} />,
    getHTMLElement(container, environment)
  );
}
