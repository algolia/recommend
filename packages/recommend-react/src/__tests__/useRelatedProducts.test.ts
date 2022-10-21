import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
  createMultiSearchResponse,
  forceDelay,
} from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
  initialState,
} from '../../../../test/utils/createRecommendClient';
import { useRelatedProducts } from '../useRelatedProducts';

function createMockedRecommendClient() {
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
  test('gets Related Products', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(() =>
      useRelatedProducts({
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
        transformItems: (items) => items,
      })
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });
  });

  test('gets related products from initialState', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(
      () =>
        useRelatedProducts({
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
          transformItems: (items) => items,
          initialState,
        }),
      {
        wrapper: React.StrictMode,
      }
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual(
        initialState.recommendations
      );
    });
  });

  test('no network calls with initialState', () => {
    const { recommendClient } = createMockedRecommendClient();

    renderHook(
      () =>
        useRelatedProducts({
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
          transformItems: (items) => items,
          initialState,
        }),
      {
        wrapper: React.StrictMode,
      }
    );

    expect(recommendClient.getRelatedProducts).toHaveBeenCalledTimes(0);
  });

  test('trigger network call when props change', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { rerender } = renderHook(
      ({ indexName }) =>
        useRelatedProducts({
          indexName,
          recommendClient,
          threshold: 0,
          objectIDs: ['testing'],
          queryParameters: {
            facetFilters: ['test'],
          },
          fallbackParameters: {
            facetFilters: ['test2'],
          },
          transformItems: (items) => items,
          initialState,
        }),
      {
        wrapper: React.StrictMode,
        initialProps: { indexName: 'test' },
      }
    );
    expect(recommendClient.getRelatedProducts).toHaveBeenCalledTimes(0);

    await forceDelay(1000);

    rerender({ indexName: 'test1' });

    expect(recommendClient.getRelatedProducts).toHaveBeenCalledTimes(1);
  });
});
