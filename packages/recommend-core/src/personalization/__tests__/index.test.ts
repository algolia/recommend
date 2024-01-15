import * as affinities from '../getAffinities';
import * as strategy from '../getStrategy';
import { getPersonalizationFilters } from '../index';

describe('personalization', () => {
  describe('getPersonalizationFilters', () => {
    it('should return an empty array if any required parameter is missing', async () => {
      const result = await getPersonalizationFilters({
        userToken: '',
        region: '',
        apiKey: '',
        appId: '',
      });

      expect(result).toEqual([]);
    });

    it('should return the optional filters with weighted scores', async () => {
      const getAffinities = jest
        .spyOn(affinities, 'getAffinities')
        .mockResolvedValue({
          userToken: 'token',
          lastEventAt: '2020-01-01',
          scores: {
            facet1: {
              value1: 5,
              value2: 8,
            },
            facet2: {
              value3: 6,
              value4: 9,
            },
          },
        });

      const getStrategy = jest
        .spyOn(strategy, 'getStrategy')
        .mockResolvedValue({
          facetsScoring: [
            { facetName: 'facet1', score: 80 },
            { facetName: 'facet2', score: 90 },
          ],
          personalizationImpact: 100,
        });

      const result = await getPersonalizationFilters({
        userToken: 'userToken',
        region: 'region',
        apiKey: 'apiKey',
        appId: 'appId',
      });

      expect(result).toEqual([
        'facet1:value1<score=4>',
        'facet1:value2<score=6>',
        'facet2:value3<score=5>',
        'facet2:value4<score=8>',
      ]);

      expect(getAffinities).toHaveBeenCalledWith({
        userToken: 'userToken',
        apiKey: 'apiKey',
        appId: 'appId',
        region: 'region',
      });

      expect(getStrategy).toHaveBeenCalledWith({
        apiKey: 'apiKey',
        appId: 'appId',
        region: 'region',
      });
    });

    it('should return an empty array if an error occurs', async () => {
      const getAffinities = jest
        .spyOn(affinities, 'getAffinities')
        .mockRejectedValue(new Error('API error'));
      const getStrategy = jest
        .spyOn(strategy, 'getStrategy')
        .mockResolvedValue({
          personalizationImpact: 100,
          facetsScoring: [],
        });

      const result = await getPersonalizationFilters({
        userToken: 'userToken',
        region: 'region',
        apiKey: 'apiKey',
        appId: 'appId',
      });

      expect(result).toEqual([]);

      expect(getAffinities).toHaveBeenCalledWith({
        userToken: 'userToken',
        apiKey: 'apiKey',
        appId: 'appId',
        region: 'region',
      });

      expect(getStrategy).toHaveBeenCalledWith({
        apiKey: 'apiKey',
        appId: 'appId',
        region: 'region',
      });
    });
  });
});
