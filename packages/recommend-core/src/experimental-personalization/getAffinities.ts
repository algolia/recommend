import { getCachedValue, setCachedValue } from './cache';

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

const isAffinities = (object: any): object is AffinitiesResponse => {
  const _object = object as AffinitiesResponse;
  return (
    _object.userToken !== undefined &&
    _object.lastEventAt !== undefined &&
    _object.scores !== undefined
  );
};

export const getAffinities = async ({
  userToken,
  region,
  apiKey,
  appId,
}: GetAffinities): Promise<AffinitiesResponse> => {
  const cached = getCachedValue({ userToken, region, apiKey, appId }, 600000); // 10 minutes
  if (cached && isAffinities(cached)) {
    return cached;
  }

  const response = await fetch(
    `https://personalization.${region}.algolia.com/1/profiles/personalization/${encodeURIComponent(
      userToken
    )}`,
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
      `Failed to fetch personalization affinities. Status: ${response.status}`
    );
  }
  const result: AffinitiesResponse = await response.json();
  setCachedValue({ userToken, region, apiKey, appId }, result);
  return result;
};
