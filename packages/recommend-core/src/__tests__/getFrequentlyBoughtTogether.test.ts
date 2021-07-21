import { createRecommendationsClient } from '../../../../test/utils';
import { getFrequentlyBoughtTogether } from '../getFrequentlyBoughtTogether';

describe('getFrequentlyBoughtTogether', () => {
  test('does not forward unwanted props', async () => {
    const { recommendClient } = createRecommendationsClient();

    await getFrequentlyBoughtTogether({
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      // @ts-expect-error unwanted props
      a: 'b',
    });

    expect(recommendClient.getFrequentlyBoughtTogether).toHaveBeenCalledTimes(
      1
    );
    expect(recommendClient.getFrequentlyBoughtTogether).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        objectID: 'objectID',
      },
    ]);
  });
});
