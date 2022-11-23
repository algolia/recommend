import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { StrictMode } from 'react';

import { getItemName, getItemPrice } from '../../../../test/utils';
import { hit, initialRecommendations } from '../../../../test/utils/constants';
import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import { createRecommendClient } from '../../../../test/utils/createRecommendClient';
import { useFrequentlyBoughtTogether } from '../useFrequentlyBoughtTogether';

function createMockedRecommendClient() {
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
  test('returns FBT recommendations', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(() =>
      useFrequentlyBoughtTogether({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        objectIDs: ['testing'],
        queryParameters: {
          facetFilters: ['test'],
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
        useFrequentlyBoughtTogether({
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

  test('returns FBT recommendations from initialState', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(
      () =>
        useFrequentlyBoughtTogether({
          indexName: 'test',
          recommendClient,
          threshold: 0,
          objectIDs: ['testing'],
          queryParameters: {
            facetFilters: ['test'],
          },
          transformItems: (items) => items,
          initialRecommendations,
        }),
      {
        wrapper: StrictMode,
      }
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual(
        initialRecommendations.recommendations
      );
      expect(result.current.status).toBe('idle');
    });
  });

  test("doesn't initially fetch the recommendations with initialState", () => {
    const { recommendClient } = createMockedRecommendClient();

    renderHook(
      () =>
        useFrequentlyBoughtTogether({
          indexName: 'test',
          recommendClient,
          threshold: 0,
          objectIDs: ['testing'],
          queryParameters: {
            facetFilters: ['test'],
          },
          transformItems: (items) => items,
          initialRecommendations,
        }),
      {
        wrapper: StrictMode,
      }
    );

    expect(recommendClient.getFrequentlyBoughtTogether).toHaveBeenCalledTimes(
      0
    );
  });

  test('fetches recommendations when props change with initialState', () => {
    const { recommendClient } = createMockedRecommendClient();

    const { rerender } = renderHook(
      ({ indexName }) =>
        useFrequentlyBoughtTogether({
          indexName,
          recommendClient,
          threshold: 0,
          objectIDs: ['testing'],
          queryParameters: {
            facetFilters: ['test'],
          },
          transformItems: (items) => items,
          initialRecommendations,
        }),
      {
        wrapper: StrictMode,
        initialProps: { indexName: 'test' },
      }
    );
    expect(recommendClient.getFrequentlyBoughtTogether).toHaveBeenCalledTimes(
      0
    );

    act(() => {
      rerender({ indexName: 'test1' });
    });

    expect(recommendClient.getFrequentlyBoughtTogether).toHaveBeenCalledTimes(
      1
    );
    expect(recommendClient.getFrequentlyBoughtTogether).toHaveBeenCalledWith([
      expect.objectContaining({
        indexName: 'test1',
      }),
    ]);
  });
});
