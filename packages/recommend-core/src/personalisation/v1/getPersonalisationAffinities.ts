import { PersonalisationParams } from '../types';

import { AffinitiesResponse } from './types';

export const getPersonalisationAffinities = async ({
  userToken,
  logRegion,
  apiKey,
  appID,
}: PersonalisationParams) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('X-Algolia-Application-Id', appID);
  headers.append('X-Algolia-API-Key', apiKey);

  const response = await fetch(
    `https://personalization.${logRegion}.algolia.com/1/profiles/personalization/${userToken}`,
    {
      cache: 'force-cache',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch personalisation affinities for application="${appID}" region="${logRegion}", user="${userToken}" status="${
        response.status
      }" error="${await response.text()}"`
    );
  }
  const result: AffinitiesResponse = await response.json();
  return result;
};