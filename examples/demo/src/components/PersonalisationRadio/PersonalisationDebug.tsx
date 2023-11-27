/* eslint-disable import/no-extraneous-dependencies */
import { getUserProfile } from '@algolia/recommend-core/src/personalisation/neural/getUserProfile';
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

export const PersonalisationDebug = ({
  userToken,
  indexName,
  personalisationVersion,
}) => {
  const [affinitiesV1, setAffinitiesV1] = React.useState<any>(null);
  const [affinitiesNeural, setAffinitiesNeural] = React.useState<any>(null);
  const [strategies, setStrategies] = React.useState<any>(null);

  useEffect(() => {
    getUserProfile({
      apiKey,
      appID: appId,
      userToken,
      logRegion: 'eu',
      indexName,
    })
      .then(setAffinitiesNeural)
      .catch(() => setAffinitiesNeural(null));

    getPersonalisationAffinities({
      apiKey,
      appID: appId,
      userToken,
      logRegion: 'eu',
      indexName,
    })
      .then(setAffinitiesV1)
      .catch(() => setAffinitiesV1(null));
    getStrategy(appId, apiKey, 'eu')
      .then(setStrategies)
      .catch(() => setStrategies(null));
  }, [personalisationVersion, userToken, indexName]);

  if (!affinitiesV1 || !affinitiesNeural) {
    return null;
  }

  return (
    <div className="perso_debug">
      <h3>
        {personalisationVersion}: <small>{userToken}</small>
      </h3>
      {personalisationVersion === 'v1' && (
        <pre>{JSON.stringify(affinitiesV1.scores, null, 1)}</pre>
      )}
      {personalisationVersion === 'neural' && (
        <pre>{JSON.stringify(affinitiesNeural.affinities, null, 1)}</pre>
      )}

      {strategies && personalisationVersion === 'v1' && (
        <>
          <h3>Strategy</h3>
          <pre>{JSON.stringify(strategies.facetsScoring, null, 1)}</pre>
        </>
      )}
    </div>
  );
};
