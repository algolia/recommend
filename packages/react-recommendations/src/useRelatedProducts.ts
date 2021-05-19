import { useMemo } from 'react';

import {
  useRecommendations,
  UseRecommendationsProps,
} from './useRecommendations';

export type UseRelatedProductsProps<TObject> = Omit<
  UseRecommendationsProps<TObject>,
  'model'
>;

export function useRelatedProducts<TObject>(
  userProps: UseRelatedProductsProps<TObject>
) {
  const props: UseRecommendationsProps<TObject> = useMemo(
    () => ({
      ...userProps,
      model: 'related-products',
    }),
    [userProps]
  );

  return useRecommendations<TObject>(props);
}
