import { SearchResponse } from '@algolia/client-search';
import { RecommendClient, TrendingFacetsQuery } from '@algolia/recommend';

import { TrendingFacet } from './types';
import { mapByScoreToRecommendations } from './utils';
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
  indexName,
  maxRecommendations,
  threshold,
  facetName,
}: GetTrendingFacetsProps<TObject>) {
  const query = {
    indexName,
    maxRecommendations,
    threshold,
    facetName,
  };

  recommendClient.addAlgoliaAgent('recommend-core', version);

  return recommendClient
    .getTrendingFacets<TObject>([query])
    .then((response) =>
      mapByScoreToRecommendations<TrendingFacet<TObject>>({
        maxRecommendations,
        hits: response.results
          .map((result) => {
            // revert type assertion once bug is fixed on client
            const _result = result as SearchResponse<TObject>;
            return _result.hits;
          })
          .flat(),
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
