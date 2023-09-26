import { GetTrendingFacetsProps } from '@algolia/recommend-core';
import {
  createTrendingFacetsComponent,
  TrendingComponentProps as TrendingFacetsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { OptionalRecommendClient } from './types/OptionalRecommendClient';
import { useTrendingFacets } from './useTrendingFacets';

const UncontrolledTrendingFacets = createTrendingFacetsComponent({
  createElement,
  Fragment,
});

export type UseTrendingFacetsProps<TObject> = OptionalRecommendClient<
  GetTrendingFacetsProps<TObject>
>;

export type TrendingFacetsProps<TObject> = UseTrendingFacetsProps<TObject> &
  Omit<
    TrendingFacetsVDOMProps<TObject>,
    'items' | 'status' | 'createElement' | 'Fragment'
  >;

export function TrendingFacets<TObject>(props: TrendingFacetsProps<TObject>) {
  const { recommendations, status } = useTrendingFacets<TObject>(props);

  return (
    <UncontrolledTrendingFacets
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
