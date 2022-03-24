export type RecordWithFacets<TObject = {}> = TObject & {
  facetName?: string;
  facetValue?: string;
};
