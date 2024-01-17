import { PersonalizationProps } from '@algolia/recommend-core';
import {
  createRelatedProductsComponent,
  RelatedProductsProps as RelatedProductsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { UseRelatedProductsProps as UseRelatedProductsPropsPrimitive } from '../RelatedProducts';

import { useRelatedProducts } from './useRelatedProducts';

const UncontrolledRelatedProducts = createRelatedProductsComponent({
  createElement,
  Fragment,
});

export type UseRelatedProductsProps<TObject> =
  | UseRelatedProductsPropsPrimitive<TObject>
  | (UseRelatedProductsPropsPrimitive<TObject> & PersonalizationProps);

export type RelatedProductsProps<TObject> = UseRelatedProductsProps<TObject> &
  Omit<
    RelatedProductsVDOMProps<TObject>,
    'items' | 'status' | 'createElement' | 'Fragment'
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
