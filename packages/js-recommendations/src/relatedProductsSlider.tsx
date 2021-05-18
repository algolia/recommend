/** @jsx h */
import {
  ProductBaseRecord,
  RelatedProductsSlider,
  RelatedProductsProps,
} from '@algolia/react-recommendations';
import { h, render } from 'preact';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { version } from './version';

export function relatedProductsSlider<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: RelatedProductsProps<TObject> & EnvironmentProps) {
  rest.searchClient.addAlgoliaAgent('js-recommendations', version);

  render(
    <RelatedProductsSlider {...rest} />,
    getHTMLElement(container, environment)
  );
}
