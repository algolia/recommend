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

type RelatedProductsProps<TObject> = GetRelatedProductsProps<TObject> &
  Omit<RelatedProductsVDOMProps<TObject>, 'items'>;

export function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  const { recommendations } = useRelatedProducts<TObject>(props);

  return <UncontrolledRelatedProducts {...props} items={recommendations} />;
}
