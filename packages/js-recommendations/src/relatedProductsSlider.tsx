import {
  ProductBaseRecord,
  RelatedProductsSlider,
  RelatedProductsProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';
import { RenderProps } from './types';
import { version } from './version';

export function relatedProductsSlider<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: RelatedProductsProps<TObject> & RenderProps) {
  rest.searchClient.addAlgoliaAgent('js-recommendations', version);

  render(
    <RelatedProductsSlider {...rest} />,
    getHTMLElement(container, environment)
  );
}
