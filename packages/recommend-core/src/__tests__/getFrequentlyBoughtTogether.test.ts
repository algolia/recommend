import { createRecommendationsClient } from '../../../../test/utils';
import { getFrequentlyBoughtTogether } from '../getFrequentlyBoughtTogether';

describe('getFrequentlyBoughtTogether', () => {
  test('does not forward unwanted props', async () => {
    const { recommendClient } = createRecommendationsClient();
    const props = {
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      a: 'b',
    };

    await getFrequentlyBoughtTogether(props);

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
