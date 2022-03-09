import { TrendingItemsQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetTrendingItemsProps<TObject> = RecommendationsProps<TObject> &
  Omit<TrendingItemsQuery, 'objectID'>;

export function getTrendingItems<TObject>({
  recommendClient,
  transformItems = (x) => x,
  fallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
}: GetTrendingItemsProps<TObject>) {
  const query = {
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    threshold,
  };

  recommendClient.addAlgoliaAgent('recommend-core', version);

  return recommendClient
    .getTrendingItems<TObject>([query])
    .then((response) =>
      mapToRecommendations({
        maxRecommendations,
        response,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
