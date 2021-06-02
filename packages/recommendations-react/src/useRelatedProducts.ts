import {
  getRelatedProducts,
  GetRelatedProductsProps,
  GetRecommendationsReturn,
} from '@algolia/recommendations-core';
import { useEffect, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';

export function useRelatedProducts<TObject>(
  props: GetRelatedProductsProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsReturn<TObject>>({
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
