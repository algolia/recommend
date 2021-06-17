import { GetFrequentlyBoughtTogetherProps } from '@algolia/recommend-core';
import {
  createFrequentlyBoughtTogetherComponent,
  FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { useFrequentlyBoughtTogether } from './useFrequentlyBoughtTogether';

const UncontrolledFrequentlyBoughtTogether = createFrequentlyBoughtTogetherComponent(
  {
    createElement,
    Fragment,
  }
);

type FrequentlyBoughtTogetherProps<
  TObject
> = GetFrequentlyBoughtTogetherProps<TObject> &
  Omit<FrequentlyBoughtTogetherVDOMProps<TObject>, 'items'>;

export function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations } = useFrequentlyBoughtTogether<TObject>(props);

  return (
    <UncontrolledFrequentlyBoughtTogether {...props} items={recommendations} />
  );
}
