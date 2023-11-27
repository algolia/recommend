import { getNestedValue } from '../personalisation/helpers';
import { personaliseRecommendations } from '../personalisation/index';
import * as Affinities from '../personalisation/v1/getPersonalisationAffinities';

describe('personalisation', () => {
  describe('getNestedValue', () => {
    const obj = {
      a: {
        b: {
          c: 'value',
        },
        arr: [
          'value1',
          {
            d: {
              e: 'value2',
            },
          },
        ],
      },
    };

    it('returns the value at the given path', () => {
      expect(getNestedValue(obj, 'a.b.c')).toBe('value');
      expect(getNestedValue(obj, 'a.arr.0')).toBe('value1');
      expect(getNestedValue(obj, 'a.arr.1.d.e')).toBe('value2');
    });

    it('returns undefined if the path does not exist', () => {
      expect(getNestedValue(obj, 'a.b.d')).toBeUndefined();
    });

    it('returns undefined if the path is empty', () => {
      expect(getNestedValue(obj, '')).toBe(undefined);
    });

    it('returns undefined if the path does not match', () => {
      expect(getNestedValue(obj, 'z')).toBe(undefined);
      expect(getNestedValue(obj, 'a.z')).toBe(undefined);
      expect(getNestedValue(obj, 'a.b.z')).toBe(undefined);
    });
  });

  describe('personaliseRecommendations', () => {
    const getPersonalisationAffinities = jest.spyOn(
      Affinities,
      'getPersonalisationAffinities'
    );

    // eslint-disable-next-line require-await
    getPersonalisationAffinities.mockImplementation(async () => {
      return {
        userToken: 'token-1',
        lastEventAt: '2020-01-01T00:00:00.000Z',
        scores: {
          brand: {
            Apple: 20,
            OnePlus: 10,
            HTC: 5,
            Samsung: 1,
          },
        },
      };
    });

    it('smoke test', async () => {
      const result = await personaliseRecommendations({
        indexName: 'index',
        hits: [
          {
            objectID: 's23',
            brand: 'Samsung',
            _score: 60,
          },
          {
            objectID: 's22',
            brand: 'Samsung',
            _score: 60,
          },
          {
            objectID: 's23',
            brand: 'Samsung',
            _score: 60,
          },
          {
            objectID: 'iphone',
            brand: 'Apple',
            _score: 60,
          },
          {
            objectID: 'op3',
            brand: 'OnePlus',
            _score: 60,
          },
          {
            objectID: 'HTC One',
            brand: 'HTC',
            _score: 60,
          },
        ],
        apiKey: 'apiKey',
        appID: 'appID',
        logRegion: 'eu',
        userToken: 'token-1',
        personalisationVersion: 'v1',
      });

      expect(result).toEqual([
        {
          objectID: 'iphone',
          brand: 'Apple',
          _score: 60,
        },
        {
          objectID: 'op3',
          brand: 'OnePlus',
          _score: 60,
        },
        {
          objectID: 'HTC One',
          brand: 'HTC',
          _score: 60,
        },
        {
          objectID: 's23',
          brand: 'Samsung',
          _score: 60,
        },
        {
          objectID: 's22',
          brand: 'Samsung',
          _score: 60,
        },
        {
          objectID: 's23',
          brand: 'Samsung',
          _score: 60,
        },
      ]);
    });
  });
});
