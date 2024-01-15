import { RecommendClient, TrendingItemsQuery } from '@algolia/recommend';

import { getPersonalizationFilters, isPersonalized } from './personalization';
import { ProductRecord } from './types';
import { PersonalizationProps } from './types/PersonalizationProps';
import { mapByScoreToRecommendations, uniqBy } from './utils';
import { version } from './version';

export type _TrendingItemsProps<TObject> = {
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
};

export type TrendingItemsProps<TObject> =
  | _TrendingItemsProps<TObject>
  | (_TrendingItemsProps<TObject> & PersonalizationProps);

export type GetTrendingItemsResult<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
};

export type GetTrendingItemsProps<TObject> = TrendingItemsProps<TObject> &
  TrendingItemsQuery;

export function getTrendingItems<TObject>(
  params: GetTrendingItemsProps<TObject>
) {
  const {
    recommendClient,
    transformItems = (x) => x,
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    threshold,
    facetName,
    facetValue,
  } = params;
  recommendClient.addAlgoliaAgent('recommend-core', version);

  /**
   * Big block of duplicated code, but it is fine since it is experimental and will be ported to the API eventually.
   * This is a temporary solution to get recommended personalization.
   */
  if (isPersonalized(params) && params.region && params.userToken) {
    recommendClient.addAlgoliaAgent('experimental-personalization');
    return getPersonalizationFilters({
      apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
      appId: recommendClient.appId,
      region: params.region,
      userToken: params.userToken,
    }).then((personalizationFilters) => {
      const query = {
        fallbackParameters,
        indexName,
        maxRecommendations,
        threshold,
        facetName,
        facetValue,
        queryParameters: {
          ...queryParameters,
          optionalFilters: [
            ...personalizationFilters,
            ...(queryParameters?.optionalFilters ?? []),
          ],
        },
      };

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
        .then((hits) => ({ recommendations: transformItems(hits) }));
    });
  }

  const query = {
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    threshold,
    facetName,
    facetValue,
  };

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
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
