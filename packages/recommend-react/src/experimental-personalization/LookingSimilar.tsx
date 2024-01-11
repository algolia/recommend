import { Experimental } from '@algolia/recommend-core';

import {
  LookingSimilarProps,
  LookingSimilar as render,
} from '../LookingSimilar';

type Props<TObject> = LookingSimilarProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function LookingSimilar<TObject>(props: Props<TObject>) {
  return render(props);
}
