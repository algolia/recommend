import { act, render, waitFor } from '@testing-library/react';
import React from 'react';

import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';
import { Recommendations } from '../Recommendations';

const hit = {
  name: 'Landoh 4-Pocket Jumpsuit',
  category: 'Women - Jumpsuits-Overalls',
  price: 250,
  url: 'women/jumpsuits-overalls/d06270-9132-995',
  hierarchical_categories: {
    lvl0: 'women',
    lvl1: 'women > jeans & bottoms',
    lvl2: 'women > jeans & bottoms > jumpsuits & overalls',
  },
  keywords: [
    'women',
    'jeans & bottoms',
    'jumpsuits & overalls',
    'Jumpsuits',
    'Loose',
    'Woven',
    'Long sleeve',
    'Grey',
  ],
  objectID: 'D06270-9132-995',
};

function Hit({ hit }) {
  return hit.name;
}

function createRecommendationsClient() {
  const index = {
    getObjects: jest.fn(() => Promise.resolve({ results: [hit] })),
  };
  const searchClient = createSearchClient({
    initIndex: jest.fn(() => index),
    search: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit],
        })
      )
    ),
  });

  return {
    index,
    searchClient,
  };
}

describe('Recommendations', () => {
  test('calls the correct index for "related-products"', async () => {
    const { index, searchClient } = createRecommendationsClient();

    act(() => {
      render(
        <Recommendations
          model="related-products"
          searchClient={searchClient}
          indexName="indexName"
          objectIDs={['objectID']}
          hitComponent={Hit}
        />
      );
    });

    expect(searchClient.initIndex).toHaveBeenCalledTimes(1);
    expect(searchClient.initIndex).toHaveBeenCalledWith(
      'ai_recommend_related-products_indexName'
    );
    expect(index.getObjects).toHaveBeenCalledTimes(1);
    expect(index.getObjects).toHaveBeenCalledWith(['objectID']);

    await waitFor(() => {
      expect(searchClient.search).toHaveBeenCalledTimes(1);
      expect(searchClient.search).toHaveBeenCalledWith([
        {
          indexName: 'indexName',
          params: {
            analytics: false,
            analyticsTags: ['alg-recommend_related-products'],
            clickAnalytics: false,
            enableABTest: false,
            filters: 'NOT objectID:objectID',
            hitsPerPage: 0,
            optionalFilters: [],
            ruleContexts: ['alg-recommend_related-products_objectID'],
            typoTolerance: false,
          },
        },
      ]);
    });
  });

  test('calls the correct index for "bought-together"', async () => {
    const { index, searchClient } = createRecommendationsClient();

    act(() => {
      render(
        <Recommendations
          model="bought-together"
          searchClient={searchClient}
          indexName="indexName"
          objectIDs={['objectID']}
          hitComponent={Hit}
        />
      );
    });

    expect(searchClient.initIndex).toHaveBeenCalledTimes(1);
    expect(searchClient.initIndex).toHaveBeenCalledWith(
      'ai_recommend_bought-together_indexName'
    );
    expect(index.getObjects).toHaveBeenCalledTimes(1);
    expect(index.getObjects).toHaveBeenCalledWith(['objectID']);

    await waitFor(() => {
      expect(searchClient.search).toHaveBeenCalledTimes(1);
      expect(searchClient.search).toHaveBeenCalledWith([
        {
          indexName: 'indexName',
          params: {
            analytics: false,
            analyticsTags: ['alg-recommend_bought-together'],
            clickAnalytics: false,
            enableABTest: false,
            filters: 'NOT objectID:objectID',
            hitsPerPage: 0,
            optionalFilters: [],
            ruleContexts: ['alg-recommend_bought-together_objectID'],
            typoTolerance: false,
          },
        },
      ]);
    });
  });
});
