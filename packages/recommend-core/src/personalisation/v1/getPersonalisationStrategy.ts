export type StrategyResponse = {
  facetsScoring: Array<{
    facetName: string;
    score: number;
  }>;
  personalizationImpact: number;
};

type GetPersonalisationStrategy = {
  appID: string;
  apiKey: string;
  logRegion: string;
};

export const getPersonalisationStrategy = async ({
  appID,
  apiKey,
  logRegion,
}: GetPersonalisationStrategy) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('X-Algolia-Application-Id', appID);
  headers.append('X-Algolia-API-Key', apiKey);

  const response = await fetch(
    `https://recommendation.${logRegion}.algolia.com/1/strategies/personalization`,
    {
      cache: 'force-cache',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch personalisation strategies for application="${appID}" region="${logRegion}", status="${
        response.status
      }" error="${await response.text()}"`
    );
  }
  const result: StrategyResponse = await response.json();
  return result;
};
