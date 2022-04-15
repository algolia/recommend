import { ProductRecord } from '../types';
import { AverageIndexes } from '../types/AverageIndexes';
import { IndexTracker } from '../types/IndexTracker';

import { getAverageIndexes } from './computeAverageIndexes';

type MapToRecommendations<TObject> = {
  hits: Array<Array<ProductRecord<TObject>>>;
  maxRecommendations?: number;
  nrOfObjs: number;
};

export function mapToRecommendations<TObject>({
  hits,
  maxRecommendations,
  nrOfObjs,
}: MapToRecommendations<TObject>) {
  const indexTracker: IndexTracker = {};

  // eslint-disable-next-line array-callback-return
  hits.map((arr) => {
    // eslint-disable-next-line array-callback-return
    arr.map((el, i) => {
      if (!indexTracker[el.objectID]) {
        indexTracker[el.objectID] = { indexSum: i, nr: 1 };
      } else {
        indexTracker[el.objectID] = {
          indexSum: indexTracker[el.objectID].indexSum + i,
          nr: indexTracker[el.objectID].nr + 1,
        };
      }
    });
  });

  const sortedAverageIndexes = getAverageIndexes(indexTracker, nrOfObjs);

  const finalOrder = sortedAverageIndexes.reduce<Array<ProductRecord<TObject>>>(
    (
      orderedHits: Array<ProductRecord<TObject>>,
      avgIndexRef: AverageIndexes
    ) => {
      const result = hits
        .flat()
        .find(
          (hit: ProductRecord<TObject>) => hit.objectID === avgIndexRef.objectID
        );
      return result ? orderedHits.concat(result) : orderedHits;
    },
    []
  );

  return finalOrder.slice(
    0,
    // We cap the number of recommendations because the previously
    // computed `hitsPerPage` was an approximation due to `Math.ceil`.
    maxRecommendations && maxRecommendations > 0
      ? maxRecommendations
      : undefined
  );
}
