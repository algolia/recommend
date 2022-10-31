import { ProductRecord } from './ProductRecord';

export type InitialState<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
};
