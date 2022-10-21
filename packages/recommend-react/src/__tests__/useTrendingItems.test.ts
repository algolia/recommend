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
  test('gets trending items', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(() =>
      useTrendingItems({
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
      })
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });
  });

  test('gets trending items from initialState', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(
      () =>
        useTrendingItems({
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
        useTrendingItems({
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
          initialState,
        }),
      {
        wrapper: React.StrictMode,
      }
    );

    expect(recommendClient.getTrendingItems).toHaveBeenCalledTimes(0);
  });

  test('trigger network call when props change', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { rerender } = renderHook(
      ({ indexName }) =>
        useTrendingItems({
          indexName,
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
          initialState,
        }),
      {
        wrapper: React.StrictMode,
        initialProps: { indexName: 'test' },
      }
    );
    expect(recommendClient.getTrendingItems).toHaveBeenCalledTimes(0);

    await forceDelay(1000);

    rerender({ indexName: 'test1' });

    expect(recommendClient.getTrendingItems).toHaveBeenCalledTimes(1);
  });
});
