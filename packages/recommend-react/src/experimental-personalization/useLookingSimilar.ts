import { Experimental } from '@algolia/recommend-core';

import { UseLookingSimilarProps } from '../LookingSimilar';
import { useLookingSimilar as hook } from '../useLookingSimilar';

type Props<TObject> = UseLookingSimilarProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function useLookingSimilar<TObject>(props: Props<TObject>) {
  return hook(props);
}
