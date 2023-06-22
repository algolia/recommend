import { RecommendClient } from '@algolia/recommend';
import { GetTrendingFacetsProps } from '@algolia/recommend-core';
import {
  createTrendingFacetsComponent,
  TrendingComponentProps as TrendingFacetsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { useTrendingFacets } from './useTrendingFacets';

const UncontrolledTrendingFacets = createTrendingFacetsComponent({
  createElement,
  Fragment,
});

export type TrendingFacetsProps<TObject> = Omit<
  GetTrendingFacetsProps<TObject>,
  'recommendClient'
> & { recommendClient?: RecommendClient } & Omit<
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
