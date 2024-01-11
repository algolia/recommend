import { UseRelatedProductsProps } from '../RelatedProducts';
import { useRelatedProducts as useHook } from '../useRelatedProducts';

import { Personalization } from './types';

type Props<TObject> = UseRelatedProductsProps<TObject> & Personalization;

export function useRelatedProducts<TObject>(props: Props<TObject>) {
  return useHook(props);
}
