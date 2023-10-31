import { RecommendClient, TrendingItemsQuery } from '@algolia/recommend';

import { personaliseRecommendations } from './personalisation';
import { ProductRecord } from './types';
import { mapByScoreToRecommendations, uniqBy } from './utils';
import { version } from './version';

export type TrendingItemsProps<TObject> = {
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
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;

  userToken?: string;
  logRegion?: string;
};

export type GetTrendingItemsResult<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
};

export type GetTrendingItemsProps<TObject> = TrendingItemsProps<TObject> &
  TrendingItemsQuery;

export function getTrendingItems<TObject>({
  recommendClient,
  transformItems = (x) => x,
  fallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
  facetName,
  facetValue,
  logRegion,
  userToken,
}: GetTrendingItemsProps<TObject>) {
  const query = {
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    threshold,
    facetName,
    facetValue,
  };

  console.log({ query });

  recommendClient.addAlgoliaAgent('recommend-core', version);

  return recommendClient
    .getTrendingItems<TObject>([query])
    .then((response) =>
      mapByScoreToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        // Multiple identical recommended `objectID`s can be returned b
        // the engine, so we need to remove duplicates.
        hits: uniqBy<ProductRecord<TObject>>(
          'objectID',
          response.results.map((result) => result.hits).flat()
        ),
      })
    )
    .then((hits) => {
      console.log({ recommendClient });

      if (logRegion && userToken) {
        return personaliseRecommendations({
          apiKey:
            recommendClient.transporter.queryParameters['x-algolia-api-key'],
          appID: recommendClient.appId,
          logRegion,
          userToken,
          hits,
        });
      }
      return hits;
    })
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
