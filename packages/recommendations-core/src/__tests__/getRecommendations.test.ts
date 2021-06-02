import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';
import { getRecommendations } from '../getRecommendations';
import { RecommendationModel } from '../types';

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
  recommendations: [
    { objectID: '1', score: 1.99 },
    { objectID: '2', score: 2.99 },
    { objectID: '3', score: 3.99 },
  ],
};

function createRecommendationsClient() {
  const index = {
    getObjects: jest.fn(() => Promise.resolve({ results: [hit] })),
  };
  const searchClient = createSearchClient({
    // @ts-expect-error `initIndex` is not part of the lite bundle
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

describe('getRecommendations', () => {
  test('calls the correct index for "related-products"', async () => {
    const { index, searchClient } = createRecommendationsClient();
    const props = {
      model: 'related-products' as RecommendationModel,
      searchClient: searchClient as any,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      searchParameters: {
        facetFilters: [['brand:Apple']],
        optionalFilters: ['category:Laptops'],
      },
    };

    await getRecommendations(props);

    expect(searchClient.initIndex).toHaveBeenCalledTimes(1);
    expect(searchClient.initIndex).toHaveBeenCalledWith(
      'ai_recommend_related-products_indexName'
    );

    expect(index.getObjects).toHaveBeenCalledTimes(1);
    expect(index.getObjects).toHaveBeenCalledWith(['objectID']);

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        params: {
          analytics: false,
          analyticsTags: ['alg-recommend_related-products'],
          clickAnalytics: false,
          enableABTest: false,
          facetFilters: [['brand:Apple']],
          filters: 'NOT objectID:objectID',
          hitsPerPage: 3,
          optionalFilters: [
            'objectID:1<score=199>',
            'objectID:2<score=299>',
            'objectID:3<score=399>',
            'category:Laptops',
          ],
          ruleContexts: ['alg-recommend_related-products_objectID'],
          typoTolerance: false,
        },
      },
    ]);
  });

  test('calls the correct index for "bought-together"', async () => {
    const { index, searchClient } = createRecommendationsClient();
    const props = {
      model: 'bought-together' as RecommendationModel,
      searchClient: searchClient as any,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      searchParameters: {
        facetFilters: [['brand:Apple']],
        optionalFilters: ['category:Laptops'],
      },
    };

    await getRecommendations(props);

    expect(searchClient.initIndex).toHaveBeenCalledTimes(1);
    expect(searchClient.initIndex).toHaveBeenCalledWith(
      'ai_recommend_bought-together_indexName'
    );

    expect(index.getObjects).toHaveBeenCalledTimes(1);
    expect(index.getObjects).toHaveBeenCalledWith(['objectID']);

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        params: {
          analytics: false,
          analyticsTags: ['alg-recommend_bought-together'],
          clickAnalytics: false,
          enableABTest: false,
          facetFilters: [
            ['objectID:1', 'objectID:2', 'objectID:3'],
            ['brand:Apple'],
          ],
          filters: 'NOT objectID:objectID',
          hitsPerPage: 3,
          optionalFilters: ['category:Laptops'],
          ruleContexts: ['alg-recommend_bought-together_objectID'],
          typoTolerance: false,
        },
      },
    ]);
  });

  test('returns recommended hits', async () => {
    const { searchClient } = createRecommendationsClient();
    const props = {
      model: 'related-products' as RecommendationModel,
      searchClient: searchClient as any,
      indexName: 'indexName',
      objectIDs: ['objectID'],
    };

    const { recommendations } = await getRecommendations(props);

    expect(recommendations).toEqual([
      {
        __indexName: 'indexName',
        __position: 1,
        __queryID: undefined,
        __recommendScore: null,
        category: 'Women - Jumpsuits-Overalls',
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
        name: 'Landoh 4-Pocket Jumpsuit',
        objectID: 'D06270-9132-995',
        price: 250,
        recommendations: [
          {
            objectID: '1',
            score: 1.99,
          },
          {
            objectID: '2',
            score: 2.99,
          },
          {
            objectID: '3',
            score: 3.99,
          },
        ],
        url: 'women/jumpsuits-overalls/d06270-9132-995',
      },
    ]);
  });
});
