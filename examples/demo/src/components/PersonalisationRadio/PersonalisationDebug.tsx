// eslint-disable-next-line import/no-extraneous-dependencies
import { getPersonalisationAffinities } from '@algolia/recommend-core/src/personalisation/v1/getPersonalisationAffinities';
import React, { useEffect } from 'react';

import { apiKey, appId } from '../../config';

type StrategyResponse = {
  facetsScoring: Array<{
    facetName: string;
    score: number;
  }>;
  personalizationImpact: number;
};

const getStrategy = async (
  appID: string,
  apiKey: string,
  logRegion: string
) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('X-Algolia-Application-Id', appID);
  headers.append('X-Algolia-API-Key', apiKey);

  const response = await fetch(
    `https://recommendation.${logRegion}.algolia.com/1/strategies/personalization`,
    {
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

export const PersonalisationDebug = ({ userToken }) => {
  const [affinities, setAffinities] = React.useState<any>(null);
  const [strategies, setStrategies] = React.useState<any>(null);

  useEffect(() => {
    getPersonalisationAffinities({
      apiKey,
      appID: appId,
      userToken,
      logRegion: 'eu',
    })
      .then(setAffinities)
      .catch(() => setAffinities(null));
    getStrategy(appId, apiKey, 'eu')
      .then(setStrategies)
      .catch(() => setStrategies(null));
  }, [userToken]);

  if (!affinities || !strategies) {
    return null;
  }

  return (
    <div className="perso_debug">
      <h3>
        Personalisation: <small>{userToken}</small>
      </h3>
      <pre>{JSON.stringify(affinities.scores, null, 1)}</pre>
      <h3>Strategy</h3>
      <pre>{JSON.stringify(strategies.facetsScoring, null, 1)}</pre>
    </div>
  );
};
