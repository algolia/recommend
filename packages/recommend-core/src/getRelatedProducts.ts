import { RelatedProductsQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { personaliseRecommendations } from './personalisation';
import { computePersonalisationFilters } from './personalisation/computePersonalisationFilters';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetRelatedProductsProps<TObject> = RecommendationsProps<TObject> &
  Omit<RelatedProductsQuery, 'objectID'>;

export async function getRelatedProducts<TObject>({
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
  personalisationOption = 'disabled',
}: GetRelatedProductsProps<TObject>) {
  const queries = objectIDs.map((objectID) => ({
    fallbackParameters,
    indexName,
    maxRecommendations,
    objectID,
    queryParameters,
    threshold,
  }));

  recommendClient.addAlgoliaAgent('recommend-core', version);

  const filters = await computePersonalisationFilters({
    apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
    appID: recommendClient.appId,
    userToken,
    logRegion,
    enabled: personalisationOption === 'filters',
  });

  const queriesPerso = queries.map((query) => {
    return {
      ...query,
      queryParameters: {
        ...query.queryParameters,
        optionalFilters: [
          ...filters,
          ...(query.queryParameters?.optionalFilters || []),
        ],
      },
    };
  });

  const response = await recommendClient.getRelatedProducts<TObject>(
    personalisationOption === 'filters' ? queriesPerso : queries
  );

  const hits = mapToRecommendations<ProductRecord<TObject>>({
    maxRecommendations,
    hits: response.results.map((result) => result.hits),
    nrOfObjs: objectIDs.length,
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
