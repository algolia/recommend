import {
  getRecommendations,
  GetRecommendationsProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';

export function useRecommendations<TObject>(
  props: GetRecommendationsProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });

  useAlgoliaAgent({ searchClient: props.searchClient });

  useEffect(() => {
    getRecommendations(props).then((response) => {
      setResult(response);
    });
  }, [props]);

  return result;
}
