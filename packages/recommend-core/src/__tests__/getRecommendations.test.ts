import {
  createMultiSearchResponse,
  createRecommendClient,
} from '../../../../test/utils';
import { getRecommendations } from '../getRecommendations';
import { RecommendModel } from '../types';

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
  const recommendClient = createRecommendClient({
    getFrequentlyBoughtTogether: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit],
        })
      )
    ),
    getRelatedProducts: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit],
        })
      )
    ),
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

describe('getRecommendations', () => {
  test('calls the correct index for "related-products"', async () => {
    const { recommendClient } = createRecommendationsClient();
    const props = {
      model: 'related-products' as RecommendModel,
      recommendClient: recommendClient as any,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      queryParameters: {
        facetFilters: [['brand:Apple']],
        optionalFilters: ['category:Laptops'],
      },
    };

    await getRecommendations([props]);

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRecommendations).toHaveBeenCalledWith([
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
    const { recommendClient } = createRecommendationsClient();
    const props = {
      model: 'bought-together' as RecommendModel,
      recommendClient: recommendClient as any,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      queryParameters: {
        facetFilters: [['brand:Apple']],
        optionalFilters: ['category:Laptops'],
      },
    };

    await getRecommendations([props]);

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRecommendations).toHaveBeenCalledWith([
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
    const { recommendClient } = createRecommendationsClient();
    const props = {
      model: 'related-products' as RecommendModel,
      recommendClient: recommendClient as any,
      indexName: 'indexName',
      objectIDs: ['objectID'],
    };

    const { recommendations } = await getRecommendations([props]);

    expect(recommendations).toEqual([
      {
        _score: null,
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
