import { createTrendingItemsComponent } from '@algolia/recommend-vdom';
import React, { createElement, Fragment, memo } from 'react';

import { TrendingItemsProps } from '../TrendingItems';

import { Personalization } from './types';
import { useTrendingItems } from './useTrendingItems';

const UncontrolledTrendingItems = createTrendingItemsComponent({
  createElement,
  Fragment,
});

type Props<TObject> = TrendingItemsProps<TObject> & Personalization;

export const TrendingItems = memo(function TrendingItems<TObject>(
  props: Props<TObject>
) {
  const { recommendations, status } = useTrendingItems<TObject>(props);

  return (
    <UncontrolledTrendingItems
      {...props}
      items={recommendations}
      status={status}
    />
  );
});
