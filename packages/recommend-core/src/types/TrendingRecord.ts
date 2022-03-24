export type TrendingFacetsRecord<TObject> = TObject & {
  _score?: number;
  facetName?: string;
  facetValue?: string;
};
