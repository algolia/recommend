type GetAffinities = {
  userToken: string;
  region: string;
  apiKey: string;
  appId: string;
};

type AffinitiesResponse = {
  userToken: string;
  lastEventAt: string;
  scores: Record<string, Record<string, number>>;
};

export const getAffinities = async ({
  userToken,
  region,
  apiKey,
  appId,
}: GetAffinities): Promise<AffinitiesResponse> => {
  const response = await fetch(
    `https://personalization.${region}.algolia.com/1/profiles/personalization/${userToken}`,
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
      `Failed to fetch personalisation affinities. Status: ${response.status}`
    );
  }

  const result: AffinitiesResponse = await response.json();
  return result;
};
