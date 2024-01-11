import { UseLookingSimilarProps } from '../LookingSimilar';
import { useLookingSimilar as useHook } from '../useLookingSimilar';

import { Personalization } from './types';

type Props<TObject> = UseLookingSimilarProps<TObject> & Personalization;

export function useLookingSimilar<TObject>(props: Props<TObject>) {
  return useHook(props);
}
