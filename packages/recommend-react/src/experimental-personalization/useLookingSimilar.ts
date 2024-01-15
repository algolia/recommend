import { Personalization } from '@algolia/recommend-core';

import { UseLookingSimilarProps } from '../LookingSimilar';
import { useLookingSimilar as useHook } from '../useLookingSimilar';

type Props<TObject> = UseLookingSimilarProps<TObject> & Personalization;

export function useLookingSimilar<TObject>(props: Props<TObject>) {
  return useHook(props);
}
