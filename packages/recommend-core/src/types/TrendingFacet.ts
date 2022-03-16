export type TrendingFacet<TObject> = TObject & {
  _score?: number;
  facetName?: string;
  facetValue?: string;
};
