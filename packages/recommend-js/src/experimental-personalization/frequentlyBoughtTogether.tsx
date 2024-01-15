/** @jsxRuntime classic */
/** @jsx h */

import { PersonalizationProps } from '@algolia/recommend-core';

import {
  FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherPropsPrimitive,
  frequentlyBoughtTogether as frequentlyBoughtTogetherPrimitive,
} from '../frequentlyBoughtTogether';
import { EnvironmentProps, HTMLTemplate } from '../types';

export type FrequentlyBoughtTogetherProps<
  TObject
> = FrequentlyBoughtTogetherPropsPrimitive<TObject, HTMLTemplate> &
  EnvironmentProps;

export function frequentlyBoughtTogether<TObject>(
  props:
    | FrequentlyBoughtTogetherProps<TObject>
    | (FrequentlyBoughtTogetherProps<TObject> & PersonalizationProps)
) {
  return frequentlyBoughtTogetherPrimitive<TObject>(props);
}
