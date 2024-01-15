import { PersonalizationProps } from '@algolia/recommend-core';

import {
  UseRecommendationsProps as UseRecommendationsPropsPrimitive,
  useRecommendations as useRecommendationsPrimitive,
} from '../useRecommendations';

export type UseRecommendationsProps<
  TObject
> = UseRecommendationsPropsPrimitive<TObject> & PersonalizationProps;

export function useRecommendations<TObject>(
  props: UseRecommendationsProps<TObject>
) {
  return useRecommendationsPrimitive(props);
}
