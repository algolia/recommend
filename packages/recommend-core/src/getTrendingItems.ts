import { RecommendClient, TrendingItemsQuery } from '@algolia/recommend';

import { computePersoFilters } from './personalisation/computeScoreFilters';
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

export async function getTrendingItems<TObject>({
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

  recommendClient.addAlgoliaAgent('recommend-core', version);

  const filters = await computePersoFilters({
    apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
    appID: recommendClient.appId,
    userToken,
    logRegion,
  });
  query.queryParameters = {
    ...query.queryParameters,
    optionalFilters: [
      ...filters,
      ...(query.queryParameters?.optionalFilters || []),
    ],
  };

  const response = await recommendClient.getTrendingItems<TObject>([query]);
  const hits = mapByScoreToRecommendations<ProductRecord<TObject>>({
    maxRecommendations,
    // Multiple identical recommended `objectID`s can be returned b
    // the engine, so we need to remove duplicates.
    hits: uniqBy<ProductRecord<TObject>>(
      'objectID',
      response.results.map((result) => result.hits).flat()
    ),
  });
  return { recommendations: transformItems(hits) };
}
