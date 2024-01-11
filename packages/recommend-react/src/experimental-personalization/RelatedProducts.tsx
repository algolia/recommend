import { Experimental } from '@algolia/recommend-core';
import React from 'react';

import {
  RelatedProductsProps,
  RelatedProducts as Component,
} from '../RelatedProducts';

type Props<TObject> = RelatedProductsProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function RelatedProducts<TObject>(props: Props<TObject>) {
  return <Component {...props} />;
}
