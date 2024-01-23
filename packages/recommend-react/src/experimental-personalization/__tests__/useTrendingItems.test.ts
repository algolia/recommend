import * as recommendCore from '@algolia/recommend-core';
import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';

import { createMultiSearchResponse } from '../../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../../test/utils/createRecommendClient';
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

jest.createMockFromModule('@algolia/recommend-core');
jest.mock('@algolia/recommend-core', () => {
  const original = jest.requireActual('@algolia/recommend-core');
  return {
    __esModule: true,
    ...original,
  };
});

describe('useTrendingItems', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not apply personalization when `userToken` and `region` are not provided', async () => {
    const { recommendClient } = createMockedRecommendClient();
    const getTrendingItemsSpy = jest
      .spyOn(recommendCore, 'getTrendingItems')
      .mockResolvedValue({ recommendations: [hit] });

    const { result, waitForNextUpdate } = renderHook(() =>
      useTrendingItems({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        queryParameters: {
          facetFilters: ['test'],
        },
      })
    );
    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });

    expect(getTrendingItemsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        indexName: 'test',
        queryParameters: {
          facetFilters: ['test'],
        },
      })
    );
  });

  it('should apply personalization when `userToken` and `region` are provided', async () => {
    const { recommendClient } = createMockedRecommendClient();
    const getTrendingItemsSpy = jest
      .spyOn(recommendCore, 'getTrendingItems')
      .mockResolvedValue({ recommendations: [hit] });
    const getPersonalizationFiltersSpy = jest
      .spyOn(recommendCore, 'getPersonalizationFilters')
      .mockResolvedValue(['filter1', 'filter2']);

    const { result, waitForNextUpdate } = renderHook(() =>
      useTrendingItems({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        userToken: 'user_token',
        region: 'eu',
        queryParameters: {
          facetFilters: ['test'],
        },
      })
    );
    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });

    expect(getTrendingItemsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        indexName: 'test',
        queryParameters: {
          facetFilters: ['test'],
          optionalFilters: ['filter1', 'filter2'],
        },
      })
    );

    expect(getPersonalizationFiltersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userToken: 'user_token',
        region: 'eu',
      })
    );
  });
});
