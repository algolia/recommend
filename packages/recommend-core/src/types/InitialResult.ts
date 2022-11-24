import { ProductRecord } from './ProductRecord';

export type InitialResult<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
};
