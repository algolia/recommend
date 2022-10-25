import type { RecommendClient } from '@algolia/recommend';

import {
  createMultiSearchResponse,
  createSingleSearchResponse,
} from './createApiResponse';

export function createRecommendClient(
  args: Partial<RecommendClient> = {}
): RecommendClient {
  return {
    appId: '',
    addAlgoliaAgent: jest.fn(),
    clearCache: jest.fn(),
    destroy: jest.fn(),
    getRecommendations: jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map(() => createSingleSearchResponse())
        )
      )
    ),
    getFrequentlyBoughtTogether: jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map(() => createSingleSearchResponse())
        )
      )
    ),
    getRelatedProducts: jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map(() => createSingleSearchResponse())
        )
      )
    ),
    getTrendingFacets: jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map(() => createSingleSearchResponse())
        )
      )
    ),
    getTrendingItems: jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map(() => createSingleSearchResponse())
        )
      )
    ),
    transporter: {
      userAgent: {
        value: '',
        add() {
          return {};
        },
      },
    } as any,
    ...args,
  };
}
