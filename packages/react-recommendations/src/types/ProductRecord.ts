export type ProductRecord<TObject> = TObject & {
  __indexName: string;
  __queryID: string | undefined;
  __position: number;
  __recommendScore: number | null;
};
