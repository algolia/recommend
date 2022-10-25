import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { hit, initialState } from '../../../../test/utils/constants';
import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import { createRecommendClient } from '../../../../test/utils/createRecommendClient';
import { forceDelay } from '../../../../test/utils/fixtures';
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

    // we force a delay in order to simulate a prop change
    // (that is a dependency prop in the useEffect from the hook we are testing)
    // so that we can test that a network call is triggered
    await forceDelay(1000);

    rerender({ indexName: 'test1' });

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
  });
});
