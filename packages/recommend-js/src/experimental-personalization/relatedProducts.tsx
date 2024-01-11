/** @jsxRuntime classic */
/** @jsx h */
import { GetRelatedProductsProps } from '@algolia/recommend-core';
import { RelatedProductsProps as RelatedProductsVDOMProps } from '@algolia/recommend-vdom';

import { relatedProducts as render } from '../relatedProducts';
import { EnvironmentProps, HTMLTemplate } from '../types';

type RelatedProductsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetRelatedProductsProps<TObject> &
  Omit<RelatedProductsVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

export function relatedProducts<TObject>({
  experimental,
  ...props
}: RelatedProductsProps<TObject, HTMLTemplate> & EnvironmentProps) {
  return render(props);
}
