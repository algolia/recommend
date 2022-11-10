import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { StrictMode } from 'react';

import { getItemName, getItemPrice } from '../../../../test/utils';
import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { useTrendingFacets } from '../useTrendingFacets';

function createMockedRecommendClient() {
  const recommendClient = createRecommendClient({
    getTrendingFacets: jest.fn(() =>
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

describe('useTrendingFacets', () => {
  test('gets trending facets', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(() =>
      useTrendingFacets({
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
      })
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });
  });

  test('assures that the transformItems function always returns an array', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result, rerender } = renderHook(
      () =>
        useTrendingFacets({
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
          transformItems: (items) => {
            return items.map((item) => {
              return item.name;
            });
          },
        }),
      {
        wrapper: StrictMode,
      }
    );
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([
        'Landoh 4-Pocket Jumpsuit',
      ]);
    });

    act(() => {
      rerender();
    });

    await waitFor(() => {
      expect(result.current.recommendations).toEqual([
        'Landoh 4-Pocket Jumpsuit',
      ]);
    });
  });

  test('assures that the transformItems function is applied properly after rerender', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result, rerender } = renderHook(
      ({ transformItems, indexName }) =>
        useTrendingFacets({
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
});
