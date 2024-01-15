import { LookingSimilarQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { getPersonalizationFilters, isPersonalized } from './personalization';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetLookingSimilarProps<TObject> = RecommendationsProps<TObject> &
  Omit<LookingSimilarQuery, 'objectID'>;

export function getLookingSimilar<TObject>(
  params: GetLookingSimilarProps<TObject>
) {
  const {
    objectIDs,
    recommendClient,
    transformItems = (x) => x,
    fallbackParameters,
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
    }).then((personalizationFilters) => {
      const queries = objectIDs.map((objectID) => ({
        fallbackParameters,
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
        .getLookingSimilar<TObject>(queries)
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
    fallbackParameters,
    indexName,
    maxRecommendations,
    objectID,
    queryParameters,
    threshold,
  }));

  return recommendClient
    .getLookingSimilar<TObject>(queries)
    .then((response) =>
      mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits),
        nrOfObjs: objectIDs.length,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
