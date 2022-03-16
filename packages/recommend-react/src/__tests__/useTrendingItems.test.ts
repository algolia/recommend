import { renderHook } from '@testing-library/react-hooks';

import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { useTrendingItems } from '../useTrendingItems';

function createMockedRecommendClient() {
  const recommendClient = createRecommendClient({
    getTrendingItems: jest.fn(() =>
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

describe('useTrendingItems', () => {
  test('gets Related Products', () => {
    const { recommendClient } = createMockedRecommendClient();

    renderHook(() => {
      const { recommendations } = useTrendingItems({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        queryParameters: {
          facetFilters: ['test'],
        },
        fallbackParameters: {
          facetFilters: ['test2'],
        },
        facetName: 'test4',
        facetValue: 'test3',
        transformItems: (items) => items,
      });

      expect(recommendations).toEqual([hit]);
    });
  });
});
