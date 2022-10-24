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
import { useRecommendations } from '../useRecommendations';

function createMockedRecommendClient() {
  const recommendClient = createRecommendClient({
    getRecommendations: jest.fn(() =>
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

describe('useRecommendations', () => {
  test('gets recommendations', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(() =>
      useRecommendations({
        model: 'bought-together',
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

  test('gets recommendations from initialState', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(
      () =>
        useRecommendations({
          model: 'bought-together',
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

  test("doesn't initially fetch the recommendations with initialState", () => {
    const { recommendClient } = createMockedRecommendClient();

    renderHook(
      () =>
        useRecommendations({
          model: 'bought-together',
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

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(0);
  });

  test('fetches recommendations when props change with initialState', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { rerender } = renderHook(
      ({ indexName }) =>
        useRecommendations({
          model: 'bought-together',
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
    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(0);

    await forceDelay(1000);

    rerender({ indexName: 'test1' });

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
  });
});
