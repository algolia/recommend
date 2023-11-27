import { FrequentlyBoughtTogetherQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import {
  computePersonalisationFilters,
  personaliseRecommendations,
} from './personalisation';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetFrequentlyBoughtTogetherProps<
  TObject
> = RecommendationsProps<TObject> &
  Omit<FrequentlyBoughtTogetherQuery, 'objectID'>;

export async function getFrequentlyBoughtTogether<TObject>({
  objectIDs,
  recommendClient,
  transformItems = (x) => x,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
  logRegion,
  userToken,
  personalisationOption = 'disabled',
  personalisationVersion = 'v1',
}: GetFrequentlyBoughtTogetherProps<TObject>) {
  const queries = objectIDs.map((objectID) => ({
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
    personalisationVersion,
    indexName,
  });

  const queriesPerso = queries.map((query) => {
    return {
      ...query,
      queryParameters: {
        ...query.queryParameters,
        userToken,
        getRankingInfo: true,
        enablePersonalization: personalisationOption === 'filters',
        optionalFilters: [
          ...filters,
          ...(query.queryParameters?.optionalFilters || []),
        ],
      },
    };
  });

  const response = await recommendClient.getFrequentlyBoughtTogether<TObject>(
    queriesPerso
  );
  const hits = mapToRecommendations<ProductRecord<TObject>>({
    maxRecommendations,
    hits: response.results.map((result) => result.hits),
    nrOfObjs: objectIDs.length,
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
