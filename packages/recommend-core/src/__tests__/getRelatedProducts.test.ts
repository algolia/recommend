import { createRecommendationsClient } from '../../../../test/utils';
import { getRelatedProducts } from '../getRelatedProducts';

describe('getRelatedProducts', () => {
  test('does not forward unwanted props', async () => {
    const { recommendClient } = createRecommendationsClient();

    await getRelatedProducts({
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
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
