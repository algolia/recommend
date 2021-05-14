import {
  ProductBaseRecord,
  RelatedProducts,
  RelatedProductsProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';
import { RenderProps } from './types';

export function relatedProducts<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: RelatedProductsProps<TObject> & RenderProps) {
  render(<RelatedProducts {...rest} />, getHTMLElement(container, environment));
}
