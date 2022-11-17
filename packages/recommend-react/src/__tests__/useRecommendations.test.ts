import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { StrictMode } from 'react';

import { getItemName, getItemPrice } from '../../../../test/utils';
import { hit, initialState } from '../../../../test/utils/constants';
import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import { createRecommendClient } from '../../../../test/utils/createRecommendClient';
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
      })
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });
  });

  test('assures that the transformItems function is applied properly after rerender', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result, rerender } = renderHook(
      ({ transformItems, indexName }) =>
        useRecommendations({
          indexName,
          model: 'bought-together',
          recommendClient,
          threshold: 0,
          objectIDs: ['testing'],
          queryParameters: {
            facetFilters: ['test'],
          },
          transformItems,
        }),
      {
        wrapper: StrictMode,
        initialProps: {
          transformItems: getItemName,
          indexName: 'test',
        },
      }
    );
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([
        'Landoh 4-Pocket Jumpsuit',
      ]);
    });

    act(() => {
      rerender({ transformItems: getItemPrice, indexName: 'test1' });
    });

    await waitFor(() => {
      expect(result.current.recommendations).toEqual([250]);
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
        wrapper: StrictMode,
      }
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual(
        initialState.recommendations
      );
      expect(result.current.status).toBe('idle');
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
        wrapper: StrictMode,
      }
    );

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(0);
  });

  test('fetches recommendations when props change with initialState', () => {
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
        wrapper: StrictMode,
        initialProps: { indexName: 'test' },
      }
    );
    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(0);

    act(() => {
      rerender({ indexName: 'test1' });
    });

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRecommendations).toHaveBeenCalledWith([
      {
        fallbackParameters: { facetFilters: ['test2'] },
        indexName: 'test1',
        maxRecommendations: undefined,
        model: 'bought-together',
        objectID: 'testing',
        queryParameters: { facetFilters: ['test'] },
        threshold: 0,
      },
    ]);
  });
});
