export type RecommendationModel = 'bought-together' | 'related-products';

export type ProductRecord = {
  objectID: string;
  recommendations?: RecommendationRecord[];
};

export type RecommendationRecord = {
  objectID: string;
  score: number;
};
