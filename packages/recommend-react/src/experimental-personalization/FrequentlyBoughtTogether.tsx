import { Experimental } from '@algolia/recommend-core';

import {
  FrequentlyBoughtTogetherProps,
  FrequentlyBoughtTogether as render,
} from '../FrequentlyBoughtTogether';

type Props<TObject> = FrequentlyBoughtTogetherProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function FrequentlyBoughtTogether<TObject>(props: Props<TObject>) {
  return render(props);
}
