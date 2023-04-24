import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { StrictMode } from 'react';

import { getItemName, getItemPrice } from '../../../../test/utils';
import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
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

function createMockedRecommendClientFailure() {
  const recommendClient = createRecommendClient({
    getFrequentlyBoughtTogether: jest.fn(
      () => Promise.reject(new Error('Could not find recommendations.')) as any
    ),
  });

  return {
    recommendClient,
  };
}

describe('useFrequentlyBoughtTogether', () => {
  test('returns FBT recommendations', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result, waitForNextUpdate } = renderHook(() =>
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
    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });
  });

  test('assures that the transformItems function is applied properly after rerender', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result, rerender, waitForNextUpdate } = renderHook(
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
    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([
        'Landoh 4-Pocket Jumpsuit',
      ]);
    });

    act(() => {
      rerender({ transformItems: getItemPrice, indexName: 'test1' });
    });

    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([250]);
    });
  });

  test('assures it handles error', async () => {
    const { recommendClient } = createMockedRecommendClientFailure();
    const handleError = jest.fn();

    const { waitForNextUpdate } = renderHook(() =>
      useFrequentlyBoughtTogether({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        objectIDs: ['testing'],
        queryParameters: {
          facetFilters: ['test'],
        },
        onError: handleError,
      })
    );

    await waitForNextUpdate();
    await waitFor(() => {
      expect(handleError).toHaveBeenCalled();
    });
  });
});
