import { ComputePersonalisationFilters } from '../types';

import { getPersonalisationAffinities } from './getPersonalisationAffinities';
import { getPersonalisationStrategy } from './getPersonalisationStrategy';

export const computePersonalisationFiltersV1 = async ({
  userToken,
  logRegion,
  apiKey,
  appID,
  enabled,
  indexName,
}: ComputePersonalisationFilters) => {
  if (!userToken || !logRegion || !enabled) {
    return [];
  }

  const result: string[] = [];

  try {
    const affinities = await getPersonalisationAffinities({
      userToken,
      logRegion,
      apiKey,
      appID,
      indexName,
    });

    const strategy = await getPersonalisationStrategy({
      apiKey,
      appID,
      logRegion,
    });

    Object.entries(affinities.scores).forEach(([facet, values]) => {
      Object.entries(values).forEach(([value, score]) => {
        const weight =
          strategy.facetsScoring.find((value) => value.facetName === facet)
            ?.score ?? 100;

        const weightedScore = Math.floor(score * (weight / 100));

        result.push(`${facet}:${value}<score=${weightedScore}>`);
      });
    });
  } catch {
    return [];
  }

  return result;
};
