import { Experimental } from '@algolia/recommend-core';

import {
  UseRecommendationsProps,
  useRecommendations as hook,
} from '../useRecommendations';

type Props<TObject> = UseRecommendationsProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function useRecommendations<TObject>(props: Props<TObject>) {
  return hook(props);
}
