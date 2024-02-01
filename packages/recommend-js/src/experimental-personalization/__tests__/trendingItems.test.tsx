/** @jsx h */
import { ObjectWithObjectID } from '@algolia/client-search';
import * as recommendCore from '@algolia/recommend-core';
import { waitFor } from '@testing-library/dom';
import { Fragment, h } from 'preact';

import { createMultiSearchResponse } from '../../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../../test/utils/createRecommendClient';
import { trendingItems } from '../trendingItems';

function createMockedRecommendClient(recommendations: ObjectWithObjectID[]) {
  const recommendClient = createRecommendClient({
    addAlgoliaAgent: jest.fn(),
    getTrendingItems: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: recommendations,
        })
      )
    ),
  });

  return recommendClient;
}

const recommendClient = createMockedRecommendClient(hit.recommendations);

jest.createMockFromModule('@algolia/recommend-core');
jest.mock('@algolia/recommend-core', () => {
  const original = jest.requireActual('@algolia/recommend-core');
  return {
    __esModule: true,
    ...original,
  };
});

describe('trendingItems', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should not apply personalization when `userToken` and `region` are not provided', async () => {
    const getPersonalizationFiltersSpy = jest.spyOn(
      recommendCore,
      'getPersonalizationFilters'
    );

    const getTrendingItemsSpy = jest
      .spyOn(recommendCore, 'getTrendingItems')
      .mockResolvedValue({ recommendations: [] });

    const container = document.createElement('div');

    trendingItems({
      container,
      recommendClient,
      indexName: 'products',
      itemComponent: ({ item }) => <Fragment>{item.objectID}</Fragment>,
      suppressExperimentalWarning: true,
    });

    await waitFor(() => {
      expect(getTrendingItemsSpy).toHaveBeenCalled();
    });

    expect(getTrendingItemsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        indexName: 'products',
      })
    );
    expect(getPersonalizationFiltersSpy).not.toHaveBeenCalled();
  });

  it('should apply personalization when `userToken` and `region` are provided', async () => {
    const getPersonalizationFiltersSpy = jest
      .spyOn(recommendCore, 'getPersonalizationFilters')
      .mockResolvedValue(['filter1', 'filter2']);

    const getTrendingItemsSpy = jest
      .spyOn(recommendCore, 'getTrendingItems')
      .mockResolvedValue({ recommendations: [] });

    const container = document.createElement('div');

    trendingItems({
      container,
      recommendClient,
      userToken: 'user_token',
      region: 'eu',
      indexName: 'products',
      queryParameters: {
        analytics: true,
      },
      itemComponent: ({ item }) => <Fragment>{item.objectID}</Fragment>,
      suppressExperimentalWarning: true,
    });

    await waitFor(() => {
      expect(getTrendingItemsSpy).toHaveBeenCalled();
    });

    expect(getTrendingItemsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        indexName: 'products',
        queryParameters: {
          analytics: true,
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

  it('should show beta warning message', async () => {
    jest
      .spyOn(recommendCore, 'getPersonalizationFilters')
      .mockResolvedValue(['filter1', 'filter2']);

    jest
      .spyOn(recommendCore, 'getTrendingItems')
      .mockResolvedValue({ recommendations: [] });
    jest.spyOn(console, 'warn').mockImplementation();

    const container = document.createElement('div');

    trendingItems({
      container,
      recommendClient,
      userToken: 'user_token',
      region: 'eu',
      indexName: 'products',
      queryParameters: {
        analytics: true,
      },
      itemComponent: ({ item }) => <Fragment>{item.objectID}</Fragment>,
      suppressExperimentalWarning: false,
    });

    await waitFor(() => {
      // eslint-disable-next-line no-console
      expect(console.warn)
        .toHaveBeenCalledWith(`[Recommend] Personalized Recommendations are experimental and subject to change.
If you have any feedback, please let us know at https://github.com/algolia/recommend/issues/new/choose
(To disable this warning, pass 'suppressExperimentalWarning' to trendingItems)`);
    });
  });
});
