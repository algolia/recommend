import { mapProfileToAffinities } from '../helpers';
import { ComputePersonalisationFilters } from '../types';

import { getUserProfile } from './getUserProfile';

export const computePersonalisationFiltersNeural = async ({
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
    const profile = await getUserProfile({
      apiKey,
      appID,
      logRegion,
      userToken,
      indexName,
    });

    const affinities = mapProfileToAffinities(profile);

    Object.entries(affinities.scores).forEach(([facet, values]) => {
      Object.entries(values).forEach(([value, score]) => {
        const weight = 100;
        const weightedScore = Math.floor(score * (weight / 100));
        result.push(`${facet}:${value}<score=${weightedScore}>`);
      });
    });
  } catch {
    return [];
  }

  return result;
};
