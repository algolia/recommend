import { LookingSimilarQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { personaliseRecommendations } from './personalisation';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetLookingSimilarProps<TObject> = RecommendationsProps<TObject> &
  Omit<LookingSimilarQuery, 'objectID'>;

export function getLookingSimilar<TObject>({
  objectIDs,
  recommendClient,
  transformItems = (x) => x,
  fallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
  logRegion,
  userToken,
}: GetLookingSimilarProps<TObject>) {
  const queries = objectIDs.map((objectID) => ({
    fallbackParameters,
    indexName,
    maxRecommendations,
    objectID,
    queryParameters,
    threshold,
  }));

  recommendClient.addAlgoliaAgent('recommend-core', version);

  return recommendClient
    .getLookingSimilar<TObject>(queries)
    .then((response) => {
      return mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits),
        nrOfObjs: objectIDs.length,
      });
    })
    .then((hits) => {
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
