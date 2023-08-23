import { RecommendClient } from '@algolia/recommend';

export type OptionalRecommendClient<TObject> = Omit<
  TObject,
  'recommendClient'
> & {
  recommendClient?: RecommendClient;
};
