import {
  ProductBaseRecord,
  FrequentlyBoughtTogether,
  FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherComponentProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';

interface FrequentlyBoughtTogetherProps<TObject extends ProductBaseRecord>
  extends FrequentlyBoughtTogetherComponentProps<TObject> {
  container: string | HTMLElement;
  environment?: typeof window;
}

export function frequentlyBoughtTogether<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: FrequentlyBoughtTogetherProps<TObject>) {
  render(
    <FrequentlyBoughtTogether {...rest} />,
    getHTMLElement(container, environment)
  );
}
