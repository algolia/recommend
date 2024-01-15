import { getCachedValue, setCachedValue } from './cache';

type GetStrategy = {
  appId: string;
  apiKey: string;
  cache?: number;
  region: string;
};

type StrategyResponse = {
  facetsScoring: Array<{
    facetName: string;
    score: number;
  }>;
  personalizationImpact: number;
};

const isStrategy = (object: any): object is StrategyResponse => {
  const _object = object as StrategyResponse;
  return (
    _object.facetsScoring !== undefined &&
    Array.isArray(_object.facetsScoring) &&
    _object.personalizationImpact !== undefined
  );
};

export const getStrategy = async ({
  region,
  apiKey,
  appId,
  cache = 1800000, // 30 minutes
}: GetStrategy) => {
  const cached = getCachedValue({ region, apiKey, appId }, cache);
  if (cached && isStrategy(cached)) {
    return cached;
  }
  const response = await fetch(
    `https://personalization.${region}.algolia.com/1/strategies/personalization`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-Application-Id': appId,
        'X-Algolia-API-Key': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch personalisation strategy. Status: ${response.status}`
    );
  }
  const result: StrategyResponse = await response.json();
  setCachedValue({ region, apiKey, appId }, result);
  return result;
};
