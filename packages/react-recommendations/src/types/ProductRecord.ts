import { RecommendationRecord } from './RecommendationRecord';

export type ProductRecord = {
  objectID: string;
  recommendations?: RecommendationRecord[];
};
