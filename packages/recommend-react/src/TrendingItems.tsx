import { GetTrendingItemsProps } from '@algolia/recommend-core';
import {
  createTrendingItemsComponent,
  TrendingItemsProps as TrendingItemsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { useTrendingItems } from './useTrendingItems';

const UncontrolledTrendingItems = createTrendingItemsComponent({
  createElement,
  Fragment,
});

export type TrendingItemsProps<TObject> = GetTrendingItemsProps<TObject> &
  Omit<TrendingItemsVDOMProps<TObject>, 'items' | 'status'>;

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
