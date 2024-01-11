import { GetLookingSimilarProps } from '@algolia/recommend-core';
import {
  createLookingSimilarComponent,
  LookingSimilarProps as LookingSimilarVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { OptionalRecommendClient } from './types/OptionalRecommendClient';
import { useLookingSimilar } from './useLookingSimilar';

const UncontrolledLookingSimilar = createLookingSimilarComponent({
  createElement,
  Fragment,
});

export type UseLookingSimilarProps<TObject> = Omit<
  OptionalRecommendClient<GetLookingSimilarProps<TObject>>,
  'experimental'
>;

export type LookingSimilarProps<TObject> = UseLookingSimilarProps<TObject> &
  Omit<
    LookingSimilarVDOMProps<TObject>,
    'items' | 'status' | 'createElement' | 'Fragment'
  >;

export function LookingSimilar<TObject>(props: LookingSimilarProps<TObject>) {
  const { recommendations, status } = useLookingSimilar<TObject>(props);

  return (
    <UncontrolledLookingSimilar
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
