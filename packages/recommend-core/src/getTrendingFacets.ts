import { TrendingFacetsQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetTrendingFacetsProps<TObject> = Omit<
  RecommendationsProps<TObject>,
  'objectIDs'
> &
  TrendingFacetsQuery;

export function getTrendingFacets<TObject>({
  recommendClient,
  transformItems = (x) => x,
  fallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
  facetName,
}: GetTrendingFacetsProps<TObject>) {
  const query = {
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    threshold,
    facetName,
  };

  recommendClient.addAlgoliaAgent('recommend-core', version);

  return recommendClient
    .getTrendingFacets<TObject>([query])
    .then((response) =>
      mapToRecommendations({
        maxRecommendations,
        response,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
