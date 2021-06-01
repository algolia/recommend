import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  RecordWithObjectID,
} from '@algolia/recommendations-core';
import { useEffect, useState } from 'react';

export function useFrequentlyBoughtTogether<TObject>(
  props: GetFrequentlyBoughtTogetherProps<TObject>
) {
  const [items, setItems] = useState<Array<RecordWithObjectID<TObject>>>([]);

  useEffect(() => {
    getFrequentlyBoughtTogether(props).then((recommendations) => {
      setItems(recommendations);
    });
  }, [props]);

  return items;
}
