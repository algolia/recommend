import { Personalization } from '@algolia/recommend-core';

import { UseFrequentlyBoughtTogetherProps } from '../FrequentlyBoughtTogether';
import { useFrequentlyBoughtTogether as useHook } from '../useFrequentlyBoughtTogether';

type Props<TObject> = UseFrequentlyBoughtTogetherProps<TObject> &
  Personalization;

export function useFrequentlyBoughtTogether<TObject>(props: Props<TObject>) {
  return useHook(props);
}
