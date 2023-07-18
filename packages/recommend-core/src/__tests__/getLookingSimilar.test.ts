import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getLookingSimilar } from '../getLookingSimilar';

describe('getLookingSimilar', () => {
  test('does not forward unwanted props', async () => {
    const recommendClient = createRecommendClient({
      getLookingSimilar: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [hit],
          })
        )
      ),
    });

    await getLookingSimilar({
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      // @ts-expect-error unwanted props
      a: 'b',
    });

    expect(recommendClient.getLookingSimilar).toHaveBeenCalledTimes(1);
    expect(recommendClient.getLookingSimilar).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        objectID: 'objectID',
      },
    ]);
  });
});
