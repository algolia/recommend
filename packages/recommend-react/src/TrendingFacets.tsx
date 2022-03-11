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

type TrendingFacetsProps<TObject> = GetTrendingFacetsProps<TObject> &
  Omit<TrendingFacetsVDOMProps<TObject>, 'items' | 'status'>;

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
