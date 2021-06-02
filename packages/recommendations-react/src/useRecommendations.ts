import {
  getRecommendations,
  GetRecommendationsProps,
  RecordWithObjectID,
} from '@algolia/recommendations-core';
import { useEffect, useState } from 'react';

import { version } from './version';

export function useRecommendations<TObject>(
  props: GetRecommendationsProps<TObject>
) {
  const [items, setItems] = useState<Array<RecordWithObjectID<TObject>>>([]);

  useEffect(() => {
    props.searchClient.addAlgoliaAgent('recommendations-react', version);
  }, [props.searchClient]);

  useEffect(() => {
    getRecommendations(props).then((recommendations) => {
      setItems(recommendations);
    });
  }, [props]);

  return items;
}
