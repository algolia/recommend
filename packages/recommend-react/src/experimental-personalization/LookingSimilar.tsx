import { Experimental } from '@algolia/recommend-core';
import React from 'react';

import {
  LookingSimilarProps,
  LookingSimilar as Component,
} from '../LookingSimilar';

type Props<TObject> = LookingSimilarProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function LookingSimilar<TObject>(props: Props<TObject>) {
  return <Component {...props} />;
}
