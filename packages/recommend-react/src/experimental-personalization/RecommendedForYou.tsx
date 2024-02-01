import { GetRecommendedForYouProps } from '@algolia/recommend-core';
import {
  createRecommendedForYouComponent,
  RecommendedForYouProps as RecommendedForYouVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { OptionalRecommendClient } from '../types/OptionalRecommendClient';

import { useRecommendedForYou } from './useRecommendedForYou';

const UncontrolledRecommendedForYou = createRecommendedForYouComponent({
  createElement,
  Fragment,
});

export type UseRecommendedForYouProps<TObject> = OptionalRecommendClient<
  GetRecommendedForYouProps<TObject>
>;

export type RecommendedForYouProps<
  TObject
> = UseRecommendedForYouProps<TObject> &
  Omit<
    RecommendedForYouVDOMProps<TObject>,
    'items' | 'status' | 'createElement' | 'Fragment'
  >;

export function RecommendedForYou<TObject>(
  props: RecommendedForYouProps<TObject>
) {
  const { recommendations, status } = useRecommendedForYou<TObject>(props);

  return (
    <UncontrolledRecommendedForYou
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
