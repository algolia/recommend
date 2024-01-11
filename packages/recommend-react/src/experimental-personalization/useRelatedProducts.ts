import { Personalization } from '@algolia/recommend-core';

import { UseRelatedProductsProps } from '../RelatedProducts';
import { useRelatedProducts as useHook } from '../useRelatedProducts';

type Props<TObject> = UseRelatedProductsProps<TObject> & Personalization;

export function useRelatedProducts<TObject>(props: Props<TObject>) {
  return useHook(props);
}
