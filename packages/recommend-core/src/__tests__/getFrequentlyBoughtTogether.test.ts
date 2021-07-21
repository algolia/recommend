import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getFrequentlyBoughtTogether } from '../getFrequentlyBoughtTogether';

describe('getFrequentlyBoughtTogether', () => {
  test('does not forward unwanted props', async () => {
    const recommendClient = createRecommendClient({
      getFrequentlyBoughtTogether: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [hit],
          })
        )
      ),
    });

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
