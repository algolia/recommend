import { AverageIndexes } from '../types/AverageIndexes';
import { IndexTracker } from '../types/IndexTracker';

export const getAverageIndexes = (
  indexTracker: IndexTracker,
  nrOfObjs: number
) => {
  const avgIndexes: AverageIndexes[] = [];

  for (const key of Object.keys(indexTracker)) {
    if (indexTracker[key].nr < 2) {
      indexTracker[key].indexSum += 100;
    }
    avgIndexes.push({
      objectID: key,
      avgOfIndexes: indexTracker[key].indexSum / nrOfObjs,
    });
  }

  return avgIndexes.sort((a, b) => (a.avgOfIndexes > b.avgOfIndexes ? 1 : -1));
};
