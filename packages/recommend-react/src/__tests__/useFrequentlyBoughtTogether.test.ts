import { renderHook } from '@testing-library/react-hooks';

import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { useFrequentlyBoughtTogether } from '../useFrequentlyBoughtTogether';

function createRecommendationsClient() {
  const recommendClient = createRecommendClient({
    getFrequentlyBoughtTogether: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit],
        })
      )
    ),
  });

  return {
    recommendClient,
  };
}

describe('useFrequentlyBoughtTogether', () => {
  test('gets Frequently Bought Together products', () => {
    const cb = jest.fn();
    const { recommendClient } = createRecommendationsClient();

    renderHook(() => {
      const { recommendations } = useFrequentlyBoughtTogether({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        objectIDs: ['testing'],
        queryParameters: {
          facetFilters: ['test'],
        },
        transformItems: (items) => {
          cb();
          return items;
        },
      });

      expect(recommendations[0]).toEqual(hit);
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });
});
