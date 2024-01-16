import { PersonalizationProps } from '@algolia/recommend-core';

import { UseLookingSimilarProps as UseLookingSimilarPropsPrimitive } from '../LookingSimilar';
import { useLookingSimilar as useLookingSimilarPrimitive } from '../useLookingSimilar';

export type UseLookingSimilarProps<TObject> =
  | UseLookingSimilarPropsPrimitive<TObject>
  | (UseLookingSimilarPropsPrimitive<TObject> & PersonalizationProps);

export function useLookingSimilar<TObject>(
  props: UseLookingSimilarProps<TObject>
) {
  return useLookingSimilarPrimitive(props);
}
