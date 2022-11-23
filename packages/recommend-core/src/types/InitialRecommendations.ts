import { ProductRecord } from './ProductRecord';

export type InitialRecommendations<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
};
