import { RecommendClient } from '@algolia/recommend';
import { GetRelatedProductsProps } from '@algolia/recommend-core';
import {
  createRelatedProductsComponent,
  RelatedProductsProps as RelatedProductsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { useRelatedProducts } from './useRelatedProducts';

const UncontrolledRelatedProducts = createRelatedProductsComponent({
  createElement,
  Fragment,
});

export type RelatedProductsProps<TObject> = Omit<
  GetRelatedProductsProps<TObject>,
  'recommendClient'
> & { recommendClient?: RecommendClient } & Omit<
    RelatedProductsVDOMProps<TObject>,
    'items' | 'status'
  >;

export function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  const { recommendations, status } = useRelatedProducts<TObject>(props);

  return (
    <UncontrolledRelatedProducts
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
