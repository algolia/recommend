/** @jsxRuntime classic */
/** @jsx h */

import { PersonalizationProps } from '@algolia/recommend-core';

import {
  RelatedProductsProps as RelatedProductsPropsPrimitive,
  relatedProducts as relatedProductsPrimitive,
} from '../relatedProducts';
import { EnvironmentProps, HTMLTemplate } from '../types';

export type RelatedProductsProps<TObject> = RelatedProductsPropsPrimitive<
  TObject,
  HTMLTemplate
> &
  EnvironmentProps;

export function relatedProducts<TObject>(
  props:
    | RelatedProductsProps<TObject>
    | (RelatedProductsProps<TObject> & PersonalizationProps)
) {
  return relatedProductsPrimitive<TObject>(props);
}
