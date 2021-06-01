import {
  getRelatedProducts,
  GetRelatedProductsProps,
  RecordWithObjectID,
} from '@algolia/recommendations-core';
import { useEffect, useState } from 'react';

export function useRelatedProducts<TObject>(
  props: GetRelatedProductsProps<TObject>
) {
  const [items, setItems] = useState<Array<RecordWithObjectID<TObject>>>([]);

  useEffect(() => {
    getRelatedProducts(props).then((recommendations) => {
      setItems(recommendations);
    });
  }, [props]);

  return items;
}
