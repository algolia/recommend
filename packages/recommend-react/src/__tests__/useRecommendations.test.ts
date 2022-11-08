import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { StrictMode } from 'react';

import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
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
        useRecommendations({
          model: 'bought-together',
          indexName: 'test',
          recommendClient,
          threshold: 0,
          objectIDs: ['testing'],
          queryParameters: {
            facetFilters: ['test'],
          },
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
});
