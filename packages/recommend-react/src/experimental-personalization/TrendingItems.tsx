import { PersonalizationProps } from '@algolia/recommend-core';
import {
  createTrendingItemsComponent,
  TrendingItemsProps as TrendingItemsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { UseTrendingItemsProps as UseTrendingItemsPropsPrimitive } from '../TrendingItems';

import { useTrendingItems } from './useTrendingItems';

const UncontrolledTrendingItems = createTrendingItemsComponent({
  createElement,
  Fragment,
});

export type UseTrendingItemsProps<TObject> =
  | UseTrendingItemsPropsPrimitive<TObject>
  | (UseTrendingItemsPropsPrimitive<TObject> & PersonalizationProps);

export type TrendingItemsProps<TObject> = UseTrendingItemsProps<TObject> &
  Omit<
    TrendingItemsVDOMProps<TObject>,
    'items' | 'status' | 'createElement' | 'Fragment'
  >;

export function TrendingItems<TObject>(props: TrendingItemsProps<TObject>) {
  const { recommendations, status } = useTrendingItems<TObject>(props);

  return (
    <UncontrolledTrendingItems
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
