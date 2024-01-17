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

export const getStrategy = async ({ region, apiKey, appId }: GetStrategy) => {
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
  return result;
};
