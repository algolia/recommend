import { Experimental } from '@algolia/recommend-core';

import { UseRelatedProductsProps } from '../RelatedProducts';
import { useRelatedProducts as hook } from '../useRelatedProducts';

type Props<TObject> = UseRelatedProductsProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function useRelatedProducts<TObject>(props: Props<TObject>) {
  return hook(props);
}
