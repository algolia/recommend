import { PersonalizationProps } from '@algolia/recommend-core';
import React from 'react';

import {
  TrendingItemsProps as TrendingItemsPropsPrimitive,
  TrendingItems as TrendingItemsPrimitive,
} from '../TrendingItems';

export type TrendingItemsProps<TObject> =
  | TrendingItemsPropsPrimitive<TObject>
  | (TrendingItemsPropsPrimitive<TObject> & PersonalizationProps);

export function TrendingItems<TObject>(props: TrendingItemsProps<TObject>) {
  return <TrendingItemsPrimitive {...props} />;
}
