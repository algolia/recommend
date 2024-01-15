import { PersonalizationProps } from '@algolia/recommend-core';
import React from 'react';

import {
  RelatedProductsProps as RelatedProductsPropsPrimitive,
  RelatedProducts as RelatedProductsPrimitive,
} from '../RelatedProducts';

export type RelatedProductsProps<
  TObject
> = RelatedProductsPropsPrimitive<TObject> & PersonalizationProps;

export function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  return <RelatedProductsPrimitive {...props} />;
}
