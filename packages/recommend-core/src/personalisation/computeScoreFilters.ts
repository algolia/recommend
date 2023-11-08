import { getPersonalisationAffinities } from './getPersonalisationAffinities';

export type ComputePersoFilters = {
  userToken?: string;
  logRegion?: string;
  appID: string;
  apiKey: string;
};

export const computePersoFilters = async ({
  userToken,
  logRegion,
  apiKey,
  appID,
}: ComputePersoFilters) => {
  if (!userToken || !logRegion) {
    return [];
  }

  const affinities = await getPersonalisationAffinities({
    userToken,
    logRegion,
    apiKey,
    appID,
  });

  const result: string[] = [];

  Object.entries(affinities.scores).forEach(([facet, values]) => {
    Object.entries(values).forEach(([value, score]) => {
      result.push(`${facet}:${value}<score=${score}>`);
    });
  });

  return result;
};
