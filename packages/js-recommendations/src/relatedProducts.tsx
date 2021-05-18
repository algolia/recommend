/** @jsx h */
import {
  RelatedProducts,
  RelatedProductsProps,
} from '@algolia/react-recommendations';
import { h, render } from 'preact';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { version } from './version';

export function relatedProducts<TObject>({
  container,
  environment,
  ...rest
}: RelatedProductsProps<TObject> & EnvironmentProps) {
  rest.searchClient.addAlgoliaAgent('js-recommendations', version);

  render(<RelatedProducts {...rest} />, getHTMLElement(container, environment));
}
