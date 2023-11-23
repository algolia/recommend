import { PersonalisationParams } from '../types';

import { UserProfileResponse } from './types';

export const getUserProfile = async ({
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
    `https://neuralperso.${logRegion}.algolia.com/2/users/${userToken}`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch personalisation profile for application="${appID}" region="${logRegion}", user="${userToken}" status="${
        response.status
      }" error="${await response.text()}"`
    );
  }
  const result: UserProfileResponse = await response.json();
  return result;
};
