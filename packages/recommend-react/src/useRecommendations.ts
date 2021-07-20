import {
  getRecommendations,
  GetRecommendationsProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useSafeEffect } from './useSafeEffect';
import { useStatus } from './useStatus';

export function useRecommendations<TObject>(
  props: GetRecommendationsProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useSafeEffect(
    (updatedProps) => {
      setStatus('loading');
      getRecommendations(updatedProps).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    },
    props,
    {
      objectIDs: props.objectIDs.join(''),
    }
  );

  return {
    ...result,
    status,
  };
}
