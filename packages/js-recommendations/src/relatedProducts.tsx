import {
  RelatedProducts,
  RelatedProductsProps,
} from '@algolia/react-recommendations/src';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { version } from './version';

export function relatedProducts<TObject>({
  container,
  environment = window,
  ...rest
}: RelatedProductsProps<TObject> & EnvironmentProps) {
  rest.searchClient.addAlgoliaAgent('js-recommendations', version);

  render(<RelatedProducts {...rest} />, getHTMLElement(container, environment));
}
