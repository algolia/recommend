import {
  getRecommendations,
  GetRecommendationsProps,
} from './getRecommendations';

export type GetFrequentlyBoughtTogetherProps<TObject> = Omit<
  GetRecommendationsProps<TObject>,
  'model' | 'fallbackParameters'
>;

export function getFrequentlyBoughtTogether<TObject>(
  userProps: GetFrequentlyBoughtTogetherProps<TObject>
) {
  const props: GetRecommendationsProps<TObject> = {
    ...userProps,
    fallbackParameters: { facetFilters: [] },
    model: 'bought-together',
  };

  return getRecommendations<TObject>(props);
}
