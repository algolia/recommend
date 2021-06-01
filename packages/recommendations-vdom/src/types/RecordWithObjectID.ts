export type RecordWithObjectID<TObject = {}> = TObject & {
  objectID: string;
};
