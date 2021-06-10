import {
  getRelatedProducts,
  GetRelatedProductsProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';

export function useRelatedProducts<TObject>(
  props: GetRelatedProductsProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });

  useAlgoliaAgent({ searchClient: props.searchClient });

  useEffect(() => {
    getRelatedProducts(props).then((response) => {
      setResult(response);
    });
  }, [props]);

  return result;
}
