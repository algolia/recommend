import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';

export function useFrequentlyBoughtTogether<TObject>(
  props: GetFrequentlyBoughtTogetherProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });

  useAlgoliaAgent({ searchClient: props.searchClient });

  useEffect(() => {
    getFrequentlyBoughtTogether(props).then((response) => {
      setResult(response);
    });
  }, [props]);

  return result;
}
