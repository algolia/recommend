import {
  ProductBaseRecord,
  FrequentlyBoughtTogether,
  FrequentlyBoughtTogetherProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';
import { RenderProps } from './types';

export function frequentlyBoughtTogether<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: FrequentlyBoughtTogetherProps<TObject> & RenderProps) {
  render(
    <FrequentlyBoughtTogether {...rest} />,
    getHTMLElement(container, environment)
  );
}
