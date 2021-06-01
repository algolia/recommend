import {
  getRecommendations,
  GetRecommendationsProps,
} from './getRecommendations';

export type GetRelatedProductsProps<TObject> = Omit<
  GetRecommendationsProps<TObject>,
  'model'
>;

export function getRelatedProducts<TObject>(
  userProps: GetRelatedProductsProps<TObject>
) {
  const props: GetRecommendationsProps<TObject> = {
    ...userProps,
    model: 'related-products',
  };

  return getRecommendations<TObject>(props);
}
