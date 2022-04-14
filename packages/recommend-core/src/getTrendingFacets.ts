import { RecommendClient, TrendingFacetsQuery } from '@algolia/recommend';

import { TrendingFacet } from './types';
import { mapWithSortToRecommendations } from './utils';
import { version } from './version';

export type TrendingFacetsProps<TObject> = {
  /**
   * The initialized Algolia recommend client.
   */
  recommendClient: RecommendClient;
  /**
   * A function to transform the retrieved items before passing them to the component.
   *
   * It’s useful to add or remove items, change them, or reorder them.
   */
  transformItems?: (
    items: Array<TrendingFacet<TObject>>
  ) => Array<TrendingFacet<TObject>>;
};

export type GetTrendingFacetsResult<TObject> = {
  recommendations: Array<TrendingFacet<TObject>>;
};

export type GetTrendingFacetsProps<TObject> = TrendingFacetsProps<TObject> &
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
      mapWithSortToRecommendations<TrendingFacet<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits).flat(),
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
