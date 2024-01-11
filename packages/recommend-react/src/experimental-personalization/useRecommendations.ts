import {
  UseRecommendationsProps,
  useRecommendations as useHook,
} from '../useRecommendations';

import { Personalization } from './types';

type Props<TObject> = UseRecommendationsProps<TObject> & Personalization;

export function useRecommendations<TObject>(props: Props<TObject>) {
  return useHook(props);
}
