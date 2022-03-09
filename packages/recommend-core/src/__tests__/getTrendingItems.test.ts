import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getTrendingItems } from '../getTrendingItems';

describe('getTrendingItems', () => {
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

    await getTrendingItems({
      recommendClient,
      indexName: 'indexName',
      // @ts-expect-error unwanted props
      a: 'b',
    });

    expect(recommendClient.getRelatedProducts).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRelatedProducts).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        objectID: 'objectID',
      },
    ]);
  });
});
