import { PersonalizationProps } from '@algolia/recommend-core';

import { UseFrequentlyBoughtTogetherProps as UseFrequentlyBoughtTogetherPropsPrimitive } from '../FrequentlyBoughtTogether';
import { useFrequentlyBoughtTogether as useFrequentlyBoughtTogetherPrimitive } from '../useFrequentlyBoughtTogether';

export type UseFrequentlyBoughtTogetherProps<
  TObject
> = UseFrequentlyBoughtTogetherPropsPrimitive<TObject> & PersonalizationProps;

export function useFrequentlyBoughtTogether<TObject>(
  props: UseFrequentlyBoughtTogetherProps<TObject>
) {
  return useFrequentlyBoughtTogetherPrimitive(props);
}
