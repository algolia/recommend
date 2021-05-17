// @TODO: extract this type to a shared package
export type RecordWithObjectID<TObject = {}> = TObject & {
  objectID: string;
};
