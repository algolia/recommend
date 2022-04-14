import { ProductRecord } from '../types';

type MapToRecommendations<TObject> = {
  hits: Array<Array<ProductRecord<TObject>>>;
  maxRecommendations?: number;
  nrOfObjs: number;
};

type AvgIndex = {
  objectID: string;
  avgOfIndexes: number;
};

type IndexTracker = {
  [key: string]: { indexSum: number; nr: number };
};

export function mapToRecommendations<TObject>({
  hits,
  maxRecommendations,
  nrOfObjs,
}: MapToRecommendations<TObject>) {
  const indexTracker: IndexTracker = {};
  const avgIndexes: AvgIndex[] = [];

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

  for (const key of Object.keys(indexTracker)) {
    if (indexTracker[key].nr < 2) {
      indexTracker[key].indexSum += 100;
    }
    avgIndexes.push({
      objectID: key,
      avgOfIndexes: indexTracker[key].indexSum / nrOfObjs,
    });
  }

  avgIndexes.sort((a, b) => (a.avgOfIndexes > b.avgOfIndexes ? 1 : -1));

  const ordered = avgIndexes.reduce<Array<ProductRecord<TObject>>>(
    (p: Array<ProductRecord<TObject>>, c: AvgIndex) => {
      const result = hits
        .flat()
        .find((f: ProductRecord<TObject>) => f.objectID === c.objectID);
      return result ? p.concat(result) : p;
    },
    []
  );

  return ordered.slice(
    0,
    // We cap the number of recommendations because the previously
    // computed `hitsPerPage` was an approximation due to `Math.ceil`.
    maxRecommendations && maxRecommendations > 0
      ? maxRecommendations
      : undefined
  );
}
