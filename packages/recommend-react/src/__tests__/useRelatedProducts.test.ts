import { renderHook } from '@testing-library/react-hooks';

import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { useRelatedProducts } from '../useRelatedProducts';

function createRecommendationsClient() {
  const recommendClient = createRecommendClient({
    getRelatedProducts: jest.fn(() =>
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

describe('useRelatedProducts', () => {
  test('gets Related Products', () => {
    const cb = jest.fn();
    const { recommendClient } = createRecommendationsClient();

    renderHook(() => {
      const { recommendations } = useRelatedProducts({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        objectIDs: ['testing'],
        queryParameters: {
          facetFilters: ['test'],
        },
        fallbackParameters: {
          facetFilters: ['test2'],
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
