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
    transporter: {
      userAgent: {
        value: '',
        add() {
          return {};
        },
      },
    } as any,
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
    ...args,
  };
}
