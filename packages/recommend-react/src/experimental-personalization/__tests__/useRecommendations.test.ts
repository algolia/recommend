import * as recommendCore from '@algolia/recommend-core';
import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';

import { createMultiSearchResponse } from '../../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../../test/utils/createRecommendClient';
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

jest.createMockFromModule('@algolia/recommend-core');
jest.mock('@algolia/recommend-core', () => {
  const original = jest.requireActual('@algolia/recommend-core');
  return {
    __esModule: true,
    ...original,
  };
});

describe('useRecommendations', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not apply personalization when `userToken` and `region` are not provided', async () => {
    const { recommendClient } = createMockedRecommendClient();
    const getRecommendationsSpy = jest
      .spyOn(recommendCore, 'getRecommendations')
      .mockResolvedValue({ recommendations: [hit] });

    const { result, waitForNextUpdate } = renderHook(() =>
      useRecommendations({
        model: 'bought-together',
        indexName: 'test',
        recommendClient,
        threshold: 0,
        objectIDs: ['testing'],
        queryParameters: {
          facetFilters: ['test'],
        },
        suppressExperimentalWarning: true,
      })
    );
    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });

    expect(getRecommendationsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        indexName: 'test',
        objectIDs: ['testing'],
        queryParameters: {
          facetFilters: ['test'],
        },
      })
    );
  });

  it('should apply personalization when `userToken` and `region` are provided', async () => {
    const { recommendClient } = createMockedRecommendClient();
    const getRecommendationsSpy = jest
      .spyOn(recommendCore, 'getRecommendations')
      .mockResolvedValue({ recommendations: [hit] });
    const getPersonalizationFiltersSpy = jest
      .spyOn(recommendCore, 'getPersonalizationFilters')
      .mockResolvedValue(['filter1', 'filter2']);

    const { result, waitForNextUpdate } = renderHook(() =>
      useRecommendations({
        model: 'bought-together',
        indexName: 'test',
        recommendClient,
        threshold: 0,
        objectIDs: ['testing'],
        userToken: 'user_token',
        region: 'eu',
        queryParameters: {
          facetFilters: ['test'],
        },
        suppressExperimentalWarning: true,
      })
    );
    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });

    expect(getRecommendationsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        indexName: 'test',
        objectIDs: ['testing'],
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
