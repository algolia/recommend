import type { SearchClient } from 'algoliasearch/lite';

import {
  createMultiSearchResponse,
  createSFFVResponse,
  createSingleSearchResponse,
} from './createApiResponse';

export function createSearchClient(
  args: Partial<SearchClient> = {}
): SearchClient {
  return {
    appId: '',
    addAlgoliaAgent: jest.fn(),
    clearCache: jest.fn(),
    // @ts-expect-error `initIndex` is not part of the lite bundle
    initIndex: jest.fn(() => ({
      getObject: jest.fn(() => Promise.resolve({})),
      search: jest.fn(() => Promise.resolve(createSingleSearchResponse())),
    })),
    transporter: {
      userAgent: {
        value: '',
        add() {
          return {};
        },
      },
    } as any,
    search: jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map(() => createSingleSearchResponse())
        )
      )
    ),
    searchForFacetValues: jest.fn(() =>
      Promise.resolve([createSFFVResponse()])
    ),
    ...args,
  };
}
