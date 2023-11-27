import { RecommendClient, TrendingItemsQuery } from '@algolia/recommend';

import {
  computePersonalisationFilters,
  personaliseRecommendations,
} from './personalisation';
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
  personalisationOption?: 'disabled' | 're-rank' | 'filters';
  readonly personalisationVersion?: 'v1' | 'neural';
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
  personalisationOption = 'disabled',
  personalisationVersion = 'v1',
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

  const filters = await computePersonalisationFilters({
    personalisationVersion,
    apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
    appID: recommendClient.appId,
    userToken,
    logRegion,
    enabled: personalisationOption === 'filters',
    indexName,
  });
  query.queryParameters = {
    ...query.queryParameters,
    userToken,
    getRankingInfo: true,
    enablePersonalization: personalisationOption === 'filters',
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
  if (logRegion && userToken && personalisationOption === 're-rank') {
    const _hits = await personaliseRecommendations({
      personalisationVersion,
      indexName,
      apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
      appID: recommendClient.appId,
      logRegion,
      userToken,
      hits,
    });
    return { recommendations: transformItems(_hits) };
  }

  return { recommendations: transformItems(hits) };
}
