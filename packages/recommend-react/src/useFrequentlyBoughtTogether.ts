import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useSafeEffect } from './useSafeEffect';
import { useStatus } from './useStatus';

export function useFrequentlyBoughtTogether<TObject>(
  props: GetFrequentlyBoughtTogetherProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useSafeEffect(
    (updatedProps) => {
      setStatus('loading');
      getFrequentlyBoughtTogether(updatedProps).then((response) => {
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
