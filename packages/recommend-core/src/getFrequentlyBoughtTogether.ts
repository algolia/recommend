import { FrequentlyBoughtTogetherQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { getPersonalizationFilters, isPersonalized } from './personalization';
import { PersonalizationProps, ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type _GetFrequentlyBoughtTogetherProps<
  TObject
> = RecommendationsProps<TObject> &
  Omit<FrequentlyBoughtTogetherQuery, 'objectID'>;

export type GetFrequentlyBoughtTogetherProps<TObject> =
  | _GetFrequentlyBoughtTogetherProps<TObject>
  | (_GetFrequentlyBoughtTogetherProps<TObject> & PersonalizationProps);

export function getFrequentlyBoughtTogether<TObject>(
  params: GetFrequentlyBoughtTogetherProps<TObject>
) {
  const {
    objectIDs,
    recommendClient,
    transformItems = (x) => x,
    indexName,
    maxRecommendations,
    queryParameters,
    threshold,
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
      cache: params.personalizationCache,
    }).then((personalizationFilters) => {
      const queries = objectIDs.map((objectID) => ({
        indexName,
        maxRecommendations,
        objectID,
        threshold,
        queryParameters: {
          ...queryParameters,
          optionalFilters: [
            ...personalizationFilters,
            ...(queryParameters?.optionalFilters ?? []),
          ],
        },
      }));

      return recommendClient
        .getFrequentlyBoughtTogether<TObject>(queries)
        .then((response) =>
          mapToRecommendations<ProductRecord<TObject>>({
            maxRecommendations,
            hits: response.results.map((result) => result.hits),
            nrOfObjs: objectIDs.length,
          })
        )
        .then((hits) => ({ recommendations: transformItems(hits) }));
    });
  }

  const queries = objectIDs.map((objectID) => ({
    indexName,
    maxRecommendations,
    objectID,
    queryParameters,
    threshold,
  }));

  return recommendClient
    .getFrequentlyBoughtTogether<TObject>(queries)
    .then((response) =>
      mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits),
        nrOfObjs: objectIDs.length,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
