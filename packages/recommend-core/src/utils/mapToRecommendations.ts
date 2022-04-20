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
  // total number of products for which we are retrieving recommendations
  // e.g. objectsIDs.length
  nrOfObjs,
}: MapToRecommendations<TObject>) {
  const indexTracker: IndexTracker = {};

  hits.forEach((hitsArray) => {
    hitsArray.forEach((hit, index) => {
      if (!indexTracker[hit.objectID]) {
        indexTracker[hit.objectID] = { indexSum: index, nr: 1 };
      } else {
        indexTracker[hit.objectID] = {
          indexSum: indexTracker[hit.objectID].indexSum + index,
          nr: indexTracker[hit.objectID].nr + 1,
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
