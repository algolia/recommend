import { getCachedValue, setCachedValue } from './cache';

type GetStrategy = {
  appId: string;
  apiKey: string;
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
    _object.personalizationImpact !== undefined &&
    Array.isArray(_object.facetsScoring)
  );
};

export const getStrategy = async ({ region, apiKey, appId }: GetStrategy) => {
  const cached = getCachedValue({ region, apiKey, appId }); // 1 minute
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
      `Failed to fetch personalization strategy. Status: ${response.status}`
    );
  }
  const result: StrategyResponse = await response.json();
  setCachedValue({ region, apiKey, appId }, result);
  return result;
};
