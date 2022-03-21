import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getTrendingItems } from '../getTrendingItems';

describe('getTrendingItems', () => {
  test('does not forward unwanted props', async () => {
    const recommendClient = createRecommendClient({
      getTrendingItems: jest.fn(() =>
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
      facetName: 'facetName',
      // @ts-expect-error unwanted props
      a: 'b',
    });

    expect(recommendClient.getTrendingItems).toHaveBeenCalledTimes(1);
    expect(recommendClient.getTrendingItems).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        facetName: 'facetName',
      },
    ]);
  });
});
