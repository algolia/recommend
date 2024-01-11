import { Experimental } from '@algolia/recommend-core';

import { UseFrequentlyBoughtTogetherProps } from '../FrequentlyBoughtTogether';
import { useFrequentlyBoughtTogether as hook } from '../useFrequentlyBoughtTogether';

type Props<TObject> = UseFrequentlyBoughtTogetherProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function useFrequentlyBoughtTogether<TObject>(props: Props<TObject>) {
  return hook(props);
}
