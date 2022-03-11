export type TrendingItemsRecord<TObject> = TObject & {
  _score?: number;
  objectID: string;
};

export type TrendingFacetsRecord<TObject> = TObject & {
  _score?: number;
  facetName: string;
  facetValue: string;
};
