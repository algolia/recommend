import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getBatchRecommendations } from '../getBatchRecommendations';
import * as mapByScoreToRecommendations from '../utils/mapByScoreToRecommendations';
import * as mapToRecommendations from '../utils/mapToRecommendations';

const recommendClient = createRecommendClient({
  getRecommendations: jest.fn(() =>
    Promise.resolve(
      createMultiSearchResponse({
        hits: [hit],
      })
    )
  ),
});

describe('getBatchRecommendations', () => {
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
    expect(Object.values(result)[0]).toEqual({ recommendations: [hit] });
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

      mapByScoreToRecommendationsSpy.mockReset();
      mapToRecommendationsSpy.mockReset();
    }
  );

  it('should transform items', async () => {
    const result = await getBatchRecommendations({
      keys: [{ key: '{"key":"key-1"}', value: 1 }],
      queries: [
        {
          indexName: 'indexName',
          model: 'bought-together',
          objectID: 'objectID',
          transformItems: (items) =>
            // @ts-expect-error
            items.map((item) => ({ ...item, name: 'QUERY_1_' + item.name })),
        },
      ],
      recommendClient,
    });

    // @ts-expect-error
    expect(result['{"key":"key-1"}'].recommendations[0].name).toEqual(
      'QUERY_1_Landoh 4-Pocket Jumpsuit'
    );
  });
});
