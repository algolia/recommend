/** @jsxRuntime classic */
/** @jsx h */

import { PersonalizationProps } from '@algolia/recommend-core';

import {
  TrendingItemsProps as TrendingItemsPropsPrimitive,
  trendingItems as trendingItemsPrimitive,
} from '../trendingItems';
import { EnvironmentProps, HTMLTemplate } from '../types';

export type TrendingItemsProps<TObject> = TrendingItemsPropsPrimitive<
  TObject,
  HTMLTemplate
> &
  EnvironmentProps;

export function trendingItems<TObject>({
  ...props
}:
  | TrendingItemsProps<TObject>
  | (TrendingItemsProps<TObject> & PersonalizationProps)) {
  return trendingItemsPrimitive<TObject>(props);
}
