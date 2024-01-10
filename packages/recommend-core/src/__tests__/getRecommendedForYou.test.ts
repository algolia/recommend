import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getRecommendedForYou } from '../getRecommendedForYou';

describe('getRecommendedForYou', () => {
  test('does not forward unwanted props', async () => {
    const recommendClient = createRecommendClient({
      getRelatedProducts: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [hit],
          })
        )
      ),
    });

    await getRecommendedForYou({
      recommendClient,
      indexName: 'indexName',
      // @ts-expect-error unwanted props
      a: 'b',
    });

    expect(recommendClient.getRecommendedForYou).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRecommendedForYou).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
      },
    ]);
  });
});
