import { AverageIndices } from '../types/AverageIndices';
import { IndexTracker } from '../types/IndexTracker';

export const getAverageIndices = (
  indexTracker: IndexTracker,
  nrOfObjs: number
) => {
  const avgIndices: AverageIndices[] = [];

  for (const key of Object.keys(indexTracker)) {
    if (indexTracker[key].nr < 2) {
      indexTracker[key].indexSum += 100;
    }
    avgIndices.push({
      objectID: key,
      avgOfIndices: indexTracker[key].indexSum / nrOfObjs,
    });
  }

  return avgIndices.sort((a, b) => (a.avgOfIndices > b.avgOfIndices ? 1 : -1));
};
