import { PersonalizationProps } from '@algolia/recommend-core';
import React from 'react';

import {
  FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherPropsPrimitive,
  FrequentlyBoughtTogether as FrequentlyBoughtTogetherPrimitive,
} from '../FrequentlyBoughtTogether';

export type FrequentlyBoughtTogetherProps<TObject> =
  | FrequentlyBoughtTogetherPropsPrimitive<TObject>
  | (FrequentlyBoughtTogetherPropsPrimitive<TObject> & PersonalizationProps);

export function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  return <FrequentlyBoughtTogetherPrimitive {...props} />;
}
