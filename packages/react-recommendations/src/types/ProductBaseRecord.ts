import { RecommendationRecord } from './RecommendationRecord';

export type ProductBaseRecord = {
  objectID: string;
  recommendations?: RecommendationRecord[];
};
