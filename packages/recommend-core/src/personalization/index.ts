import { PersonalizationProps } from '../types';

import { getAffinities } from './getAffinities';
import { getStrategy } from './getStrategy';

type GetPersonalizationFilters = {
  userToken: string;
  region: string;
  apiKey: string;
  appId: string;
  cache?: PersonalizationProps['personalizationCache'];
};

export const getPersonalizationFilters = async ({
  userToken,
  region,
  apiKey,
  appId,
  cache,
}: GetPersonalizationFilters) => {
  if (!region || !apiKey || !appId) {
    throw new Error(
      `[Algolia Recommend] parameters 'region', 'apiKey' and 'appId' are required to enable personalization.`
    );
  }
  if (!userToken) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Algolia Recommend] parameter 'userToken' is required to enable personalization.`
    );
    return [];
  }

  try {
    const [affinities, strategy] = await Promise.all([
      getAffinities({
        userToken,
        apiKey,
        appId,
        region,
        cache: cache?.profileMs,
      }),
      getStrategy({ apiKey, appId, region, cache: cache?.strategyMs }),
    ]);

    const FALLBACK_WEIGHT = 100;
    const facetsScoringMap = new Map(
      strategy.facetsScoring.map((value) => [value.facetName, value.score])
    );

    const optionalFilters = Object.entries(affinities.scores).flatMap(
      ([facet, values]) =>
        Object.entries(values).map(([value, score]) => {
          const weight = facetsScoringMap.get(facet) ?? FALLBACK_WEIGHT;
          const weightedScore = Math.floor(score * (weight / 100));
          return `${facet}:${value}<score=${weightedScore}>`;
        })
    );

    return optionalFilters;
  } catch (error) {
    return [];
  }
};

export const isPersonalized = (object: any): object is PersonalizationProps => {
  return (
    (object.region === 'eu' || object.region === 'us') &&
    typeof object.userToken === 'string'
  );
};
