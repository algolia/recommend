import {
  createFrequentlyBoughtTogetherComponent,
  FrequentlyBoughtTogetherProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { useFrequentlyBoughtTogether } from './useFrequentlyBoughtTogether';

const UncontrolledFrequentlyBoughtTogether = createFrequentlyBoughtTogetherComponent(
  {
    createElement,
    Fragment,
  }
);

export function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations } = useFrequentlyBoughtTogether<TObject>(props);

  return (
    <UncontrolledFrequentlyBoughtTogether {...props} items={recommendations} />
  );
}
