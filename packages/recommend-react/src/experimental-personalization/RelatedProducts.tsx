import { Experimental } from '@algolia/recommend-core';

import {
  RelatedProductsProps,
  RelatedProducts as render,
} from '../RelatedProducts';

type Props<TObject> = RelatedProductsProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function RelatedProducts<TObject>(props: Props<TObject>) {
  return render(props);
}
