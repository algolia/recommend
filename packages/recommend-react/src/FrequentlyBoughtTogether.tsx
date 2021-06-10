import {
  createFrequentlyBoughtTogetherComponent,
  FrequentlyBoughtTogetherProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { useRelatedProducts } from './useRelatedProducts';

const UncontrolledFrequentlyBoughtTogether = createFrequentlyBoughtTogetherComponent(
  {
    createElement,
    Fragment,
  }
);

export function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations } = useRelatedProducts<TObject>(props);

  return (
    <UncontrolledFrequentlyBoughtTogether {...props} items={recommendations} />
  );
}
