/** @jsxRuntime classic */
/** @jsx h */
import { getPersonalizationFilters } from '@algolia/recommend-core';
import { useEffect, useState } from 'preact/hooks';

export type GetPersonalizationFilter = {
  apiKey: string;
  appId: string;
  region?: 'eu' | 'us';
  userToken?: string;
};

export const usePersonalizationFilters = ({
  apiKey,
  appId,
  userToken,
  region,
}: GetPersonalizationFilter) => {
  const [status, setStatus] = useState('loading');
  const [filters, setPersonalizationFilters] = useState<string[]>([]);

  useEffect(() => {
    if (userToken && region) {
      setStatus('loading');
      getPersonalizationFilters({
        apiKey,
        appId,
        region,
        userToken,
      })
        .then((result) => {
          setPersonalizationFilters(result);
          setStatus('idle');
        })
        .catch(() => {
          setStatus('stalled');
        });
    } else {
      setStatus('idle');
      setPersonalizationFilters([]);
    }
  }, [apiKey, appId, userToken, region, setStatus]);

  return {
    filterStatus: status,
    personalizationFilters: filters,
  };
};
