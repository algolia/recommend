import { PersonalizationProps } from '@algolia/recommend-core';

import { UseRelatedProductsProps as UseRelatedProductsPropsPrimitive } from '../RelatedProducts';
import { useRelatedProducts as useRelatedProductsPrimitive } from '../useRelatedProducts';

export type UseRelatedProductsProps<
  TObject
> = UseRelatedProductsPropsPrimitive<TObject> & PersonalizationProps;

export function useRelatedProducts<TObject>(
  props: UseRelatedProductsProps<TObject>
) {
  return useRelatedProductsPrimitive(props);
}
