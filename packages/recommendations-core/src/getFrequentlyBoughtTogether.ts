import {
  getRecommendations,
  GetRecommendationsProps,
} from './getRecommendations';

export type GetFrequentlyBoughtTogetherProps<TObject> = Omit<
  GetRecommendationsProps<TObject>,
  'model' | 'fallbackFilters'
>;

export function getFrequentlyBoughtTogether<TObject>(
  userProps: GetFrequentlyBoughtTogetherProps<TObject>
) {
  const props: GetRecommendationsProps<TObject> = {
    ...userProps,
    fallbackFilters: [],
    model: 'bought-together',
  };

  return getRecommendations<TObject>(props);
}
