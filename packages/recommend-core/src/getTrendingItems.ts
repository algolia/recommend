import { RecommendClient, TrendingItemsQuery } from '@algolia/recommend';

import { personaliseRecommendations } from './personalisation';
import { computePersonalisationFilters } from './personalisation/computePersonalisationFilters';
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
    apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
    appID: recommendClient.appId,
    userToken,
    logRegion,
    enabled: personalisationOption === 'filters',
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
  if (logRegion && userToken && personalisationOption === 're-rank') {
    const _hits = await personaliseRecommendations({
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
