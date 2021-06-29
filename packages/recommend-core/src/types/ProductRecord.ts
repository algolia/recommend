export type ProductRecord<TObject> = TObject & {
  objectID: string;
  _score?: number;
};
