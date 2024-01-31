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
import { lookingSimilar } from '../lookingSimilar';

function createMockedRecommendClient(recommendations: ObjectWithObjectID[]) {
  const recommendClient = createRecommendClient({
    addAlgoliaAgent: jest.fn(),
    getLookingSimilar: jest.fn(() =>
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

describe('lookingSimilar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not apply personalization when `userToken` and `region` are not provided', async () => {
    const getPersonalizationFiltersSpy = jest.spyOn(
      recommendCore,
      'getPersonalizationFilters'
    );

    const getLookingSimilarSpy = jest
      .spyOn(recommendCore, 'getLookingSimilar')
      .mockResolvedValue({ recommendations: [] });

    const container = document.createElement('div');

    lookingSimilar({
      container,
      recommendClient,
      indexName: 'products',
      objectIDs: ['D06270-9132-995'],
      itemComponent: ({ item }) => <Fragment>{item.objectID}</Fragment>,
      suppressExperimentalWarning: true,
    });

    await waitFor(() => {
      expect(getLookingSimilarSpy).toHaveBeenCalled();
    });

    expect(getLookingSimilarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
      })
    );
    expect(getPersonalizationFiltersSpy).not.toHaveBeenCalled();
  });

  it('should apply personalization when `userToken` and `region` are provided', async () => {
    const getPersonalizationFiltersSpy = jest
      .spyOn(recommendCore, 'getPersonalizationFilters')
      .mockResolvedValue(['filter1', 'filter2']);

    const getLookingSimilarSpy = jest
      .spyOn(recommendCore, 'getLookingSimilar')
      .mockResolvedValue({ recommendations: [] });

    const container = document.createElement('div');

    lookingSimilar({
      container,
      recommendClient,
      userToken: 'user_token',
      region: 'eu',
      indexName: 'products',
      objectIDs: ['D06270-9132-995'],
      queryParameters: {
        analytics: true,
      },
      itemComponent: ({ item }) => <Fragment>{item.objectID}</Fragment>,
      suppressExperimentalWarning: true,
    });

    await waitFor(() => {
      expect(getLookingSimilarSpy).toHaveBeenCalled();
    });

    expect(getLookingSimilarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
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
});
