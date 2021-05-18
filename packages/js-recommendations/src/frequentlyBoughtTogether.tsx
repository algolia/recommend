import {
  FrequentlyBoughtTogether,
  FrequentlyBoughtTogetherProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { version } from './version';

export function frequentlyBoughtTogether<TObject>({
  container,
  environment,
  ...rest
}: FrequentlyBoughtTogetherProps<TObject> & EnvironmentProps) {
  rest.searchClient.addAlgoliaAgent('js-recommendations', version);

  render(
    <FrequentlyBoughtTogether {...rest} />,
    getHTMLElement(container, environment)
  );
}
