import { ProductRecord } from './ProductRecord';

export type InitialResults<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
};
