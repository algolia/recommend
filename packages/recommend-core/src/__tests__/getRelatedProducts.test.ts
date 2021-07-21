import { createRecommendationsClient } from '../../../../test/utils';
import { getRelatedProducts } from '../getRelatedProducts';

describe('getRelatedProducts', () => {
  test('does not forward unwanted props', async () => {
    const { recommendClient } = createRecommendationsClient();
    const props = {
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      a: 'b',
    };

    await getRelatedProducts(props);

    expect(recommendClient.getRelatedProducts).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRelatedProducts).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        objectID: 'objectID',
      },
    ]);
  });
});
