import {
  ProductBaseRecord,
  RelatedProductsSlider,
  RelatedProductsProps as RelatedProductsComponentProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';

interface RelatedProductsProps<TObject extends ProductBaseRecord>
  extends RelatedProductsComponentProps<TObject> {
  container: string | HTMLElement;
  environment?: typeof window;
}

export function relatedProductsSlider<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: RelatedProductsProps<TObject>) {
  render(
    <RelatedProductsSlider {...rest} />,
    getHTMLElement(container, environment)
  );
}
