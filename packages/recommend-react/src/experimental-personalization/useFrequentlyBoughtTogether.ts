import { UseFrequentlyBoughtTogetherProps } from '../FrequentlyBoughtTogether';
import { useFrequentlyBoughtTogether as useHook } from '../useFrequentlyBoughtTogether';

import { Personalization } from './types';

type Props<TObject> = UseFrequentlyBoughtTogetherProps<TObject> &
  Personalization;

export function useFrequentlyBoughtTogether<TObject>(props: Props<TObject>) {
  return useHook(props);
}
