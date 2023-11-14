import { getPersonalisationAffinities } from './getPersonalisationAffinities';

export type ComputePersonalisationFilters = {
  userToken?: string;
  logRegion?: string;
  appID: string;
  apiKey: string;
  enabled: boolean;
};

export const computePersonalisationFilters = async ({
  userToken,
  logRegion,
  apiKey,
  appID,
  enabled,
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
    });

    Object.entries(affinities.scores).forEach(([facet, values]) => {
      Object.entries(values).forEach(([value, score]) => {
        result.push(`${facet}:${value}<score=${score}>`);
      });
    });
  } catch (e) {
    console.log(e);
  }

  return result;
};
