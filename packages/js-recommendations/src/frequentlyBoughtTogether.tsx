import {
  ProductBaseRecord,
  FrequentlyBoughtTogether,
  FrequentlyBoughtTogetherProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';
import { RenderProps } from './types';
import { version } from './version';

export function frequentlyBoughtTogether<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: FrequentlyBoughtTogetherProps<TObject> & RenderProps) {
  rest.searchClient.addAlgoliaAgent('js-recommendations', version);

  render(
    <FrequentlyBoughtTogether {...rest} />,
    getHTMLElement(container, environment)
  );
}
