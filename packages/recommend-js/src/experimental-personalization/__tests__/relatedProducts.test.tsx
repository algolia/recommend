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
import { relatedProducts } from '../relatedProducts';

function createMockedRecommendClient(recommendations: ObjectWithObjectID[]) {
  const recommendClient = createRecommendClient({
    addAlgoliaAgent: jest.fn(),
    getRelatedProducts: jest.fn(() =>
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

describe('relatedProducts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should not apply personalization when `userToken` and `region` are not provided', async () => {
    const getPersonalizationFiltersSpy = jest.spyOn(
      recommendCore,
      'getPersonalizationFilters'
    );

    const getRelatedProductsSpy = jest
      .spyOn(recommendCore, 'getRelatedProducts')
      .mockResolvedValue({ recommendations: [] });

    const container = document.createElement('div');

    relatedProducts({
      container,
      recommendClient,
      indexName: 'products',
      objectIDs: ['D06270-9132-995'],
      itemComponent: ({ item }) => <Fragment>{item.objectID}</Fragment>,
      suppressExperimentalWarning: true,
    });

    await waitFor(() => {
      expect(getRelatedProductsSpy).toHaveBeenCalled();
    });

    expect(getRelatedProductsSpy).toHaveBeenCalledWith(
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

    const getRelatedProductsSpy = jest
      .spyOn(recommendCore, 'getRelatedProducts')
      .mockResolvedValue({ recommendations: [] });

    const container = document.createElement('div');

    relatedProducts({
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
      expect(getRelatedProductsSpy).toHaveBeenCalled();
    });

    expect(getRelatedProductsSpy).toHaveBeenCalledWith(
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
