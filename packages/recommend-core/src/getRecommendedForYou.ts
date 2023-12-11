import { Hit } from '@algolia/client-search';
import { RecommendClient, RecommendedForYouQuery } from '@algolia/recommend';

import { version } from './version';

export type GetRecommendedForYouProps<TObject> = {
  /**
   * The initialized Algolia recommend client.
   */
  recommendClient: RecommendClient;
  /**
   * A function to transform the retrieved items before passing them to the component.
   * It’s useful to add or remove items, change them, or reorder them.
   */
  transformItems?: (items: Array<Hit<TObject>>) => Array<Hit<TObject>>;
} & RecommendedForYouQuery;

export function getRecommendedForYou<TObject>({
  indexName,
  threshold,
  queryParameters,
  recommendClient,
  maxRecommendations,
  transformItems = (x) => x,
}: GetRecommendedForYouProps<TObject>) {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  const queries: RecommendedForYouQuery[] = [
    {
      indexName,
      threshold,
      queryParameters,
      maxRecommendations,
    },
  ];

  return recommendClient
    .getRecommendedForYou<TObject>(queries)
    .then((hits) => ({
      recommendations: transformItems(
        hits.results.map((result) => result.hits).flat()
      ),
    }));
}
