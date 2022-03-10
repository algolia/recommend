import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getTrendingFacets } from '../getTrendingFacets';

describe('getTrendingFacets', () => {
  test('does not forward unwanted props', async () => {
    const recommendClient = createRecommendClient({
      getTrendingFacets: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [hit],
          })
        )
      ),
    });

    await getTrendingFacets({
      recommendClient,
      indexName: 'indexName',
      // @ts-expect-error unwanted props
      a: 'b',
    });

    expect(recommendClient.getTrendingFacets).toHaveBeenCalledTimes(1);
    expect(recommendClient.getTrendingFacets).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
      },
    ]);
  });
});
