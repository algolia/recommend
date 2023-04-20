import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getBatchRecommendations } from '../getBatchRecommendations';
import * as mapByScoreToRecommendations from '../utils/mapByScoreToRecommendations';
import * as mapToRecommendations from '../utils/mapToRecommendations';

describe('getBatchRecommendations', () => {
  const recommendClient = createRecommendClient({
    getFrequentlyBoughtTogether: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit],
        })
      )
    ),
  });

  it('should call recommendClient', async () => {
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

  it.each([
    {
      model: 'trending-facets',
      mapByScore: true,
      mapTo: false,
    },
    {
      model: 'trending-items',
      mapByScore: true,
      mapTo: false,
    },
    {
      model: 'bought-together',
      mapByScore: false,
      mapTo: true,
    },
    {
      model: 'related-products',
      mapByScore: false,
      mapTo: true,
    },
  ])(
    'should use the proper mapper for $model model',
    async ({ model, mapByScore, mapTo }) => {
      const mapByScoreToRecommendationsSpy = jest
        .spyOn(mapByScoreToRecommendations, 'mapByScoreToRecommendations')
        .mockReturnValue([]);
      const mapToRecommendationsSpy = jest
        .spyOn(mapToRecommendations, 'mapToRecommendations')
        .mockReturnValue([]);

      await getBatchRecommendations({
        keys: [
          {
            key: JSON.stringify({ key: 'key-1', model }),
            value: 1,
          },
        ],
        queries: [
          {
            // @ts-expect-error
            model,
            indexName: 'indexName',
            objectID: 'objectID',
          },
        ],
        recommendClient,
      });

      expect(mapByScoreToRecommendationsSpy).toHaveBeenCalledTimes(
        mapByScore ? 1 : 0
      );
      expect(mapToRecommendationsSpy).toHaveReturnedTimes(mapTo ? 1 : 0);
    }
  );
});
