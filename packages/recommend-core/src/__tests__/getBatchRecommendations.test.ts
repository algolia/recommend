import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getBatchRecommendations } from '../getBatchRecommendations';

describe('getBatchRecommendations', () => {
  it('does call recommendClient', async () => {
    const recommendClient = createRecommendClient({
      getFrequentlyBoughtTogether: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [hit],
          })
        )
      ),
    });

    const result = await getBatchRecommendations({
      keys: [{ key: '{"key":"key-1"}', value: 1 }],
      queries: [
        {
          indexName: 'indexName',
          model: 'bought-together',
          objectID: 'objectID',
        },
      ],
      recommendClient,
    });

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);

    expect(Object.keys(result)[0]).toEqual('{"key":"key-1"}');
  });
});
