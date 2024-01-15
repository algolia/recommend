import { Personalization } from '@algolia/recommend-core';

import {
  UseRecommendationsProps,
  useRecommendations as useHook,
} from '../useRecommendations';

type Props<TObject> = UseRecommendationsProps<TObject> & Personalization;

export function useRecommendations<TObject>(props: Props<TObject>) {
  return useHook(props);
}
