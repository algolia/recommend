import {
  FrequentlyBoughtTogether,
  FrequentlyBoughtTogetherProps,
} from '@algolia/react-recommendations/src';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { version } from './version';

export function frequentlyBoughtTogether<TObject>({
  container,
  environment = window,
  ...rest
}: FrequentlyBoughtTogetherProps<TObject> & EnvironmentProps) {
  rest.searchClient.addAlgoliaAgent('js-recommendations', version);

  render(
    <FrequentlyBoughtTogether {...rest} />,
    getHTMLElement(container, environment)
  );
}
