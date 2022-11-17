import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { StrictMode } from 'react';

import { getItemName, getItemPrice } from '../../../../test/utils';
import { hit, initialState } from '../../../../test/utils/constants';
import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import { createRecommendClient } from '../../../../test/utils/createRecommendClient';
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
        useRelatedProducts({
          indexName,
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
        wrapper: StrictMode,
      }
    );

    expect(recommendClient.getRelatedProducts).toHaveBeenCalledTimes(0);
  });

  test('fetches recommendations when props change with initialState', () => {
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
        wrapper: StrictMode,
        initialProps: { indexName: 'test' },
      }
    );
    expect(recommendClient.getRelatedProducts).toHaveBeenCalledTimes(0);

    act(() => {
      rerender({ indexName: 'test1' });
    });

    expect(recommendClient.getRelatedProducts).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRelatedProducts).toHaveBeenCalledWith([
      {
        fallbackParameters: { facetFilters: ['test2'] },
        indexName: 'test1',
        maxRecommendations: undefined,
        objectID: 'testing',
        queryParameters: { facetFilters: ['test'] },
        threshold: 0,
      },
    ]);
  });
});
