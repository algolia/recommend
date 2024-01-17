import * as affinities from '../getAffinities';
import * as strategy from '../getStrategy';
import { getPersonalizationFilters } from '../index';

describe('personalization', () => {
  describe('getPersonalizationFilters', () => {
    it('should return an empty array if userToken parameter is missing', async () => {
      jest.spyOn(console, 'warn').mockImplementation();

      const result = await getPersonalizationFilters({
        userToken: '',
        region: 'eu',
        apiKey: '123465',
        appId: '123456',
      });

      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledWith(
        "[Algolia Recommend] Personalization couldn't be enabled because `userToken` is missing. Falling back to non-personalized recommendations."
      );
      expect(result).toEqual([]);
    });

    it('should return an empty array if `getStrategy` throws an error', async () => {
      jest.spyOn(console, 'error').mockImplementation();

      const getStrategy = jest
        .spyOn(strategy, 'getStrategy')
        .mockImplementation(() => {
          throw new Error('strategy_error_message');
        });
      const getAffinities = jest
        .spyOn(affinities, 'getAffinities')
        .mockResolvedValue({
          userToken: 'token',
          lastEventAt: '2020-01-01',
          scores: {},
        });

      const result = await getPersonalizationFilters({
        userToken: 'userToken',
        region: 'eu',
        apiKey: '123465',
        appId: '123456',
      });

      expect(getStrategy).toHaveBeenCalledTimes(1);
      expect(getAffinities).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith(
        "[Algolia Recommend] Personalization couldn't be enabled. Falling back to non-personalized recommendations. Error: strategy_error_message"
      );
      expect(result).toEqual([]);
    });

    it('should return an empty array if `getAffinities` throws an error', async () => {
      jest.spyOn(console, 'error').mockImplementation();

      const getAffinities = jest
        .spyOn(affinities, 'getAffinities')
        .mockImplementation(() => {
          throw new Error('affinities_error_message');
        });

      const result = await getPersonalizationFilters({
        userToken: 'userToken',
        region: 'eu',
        apiKey: '123465',
        appId: '123456',
      });

      expect(getAffinities).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith(
        "[Algolia Recommend] Personalization couldn't be enabled. Falling back to non-personalized recommendations. Error: affinities_error_message"
      );
      expect(result).toEqual([]);
    });

    it('should throw an error if parameter `region` is missing', async () => {
      await expect(
        getPersonalizationFilters({
          userToken: 'token',
          region: '',
          apiKey: 'apiKey',
          appId: 'appId',
        })
      ).rejects.toThrow(
        '[Algolia Recommend] parameter `region` is required to enable personalization.'
      );
    });

    it('should return the correct filters', async () => {
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
  });
});
