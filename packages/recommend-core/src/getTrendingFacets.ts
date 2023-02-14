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
  queryID?: string;
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
    .then((response) => ({
      hits: mapByScoreToRecommendations<TrendingFacet<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits).flat(),
      }),
      queryID: response.results.map((result) => result.queryID)[0],
    }))
    .then(({ hits, queryID }) => ({
      recommendations: transformItems(hits),
      queryID,
    }));
}
