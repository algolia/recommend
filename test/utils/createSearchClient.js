import { createMultiSearchResponse, createSFFVResponse, createSingleSearchResponse, } from './createApiResponse';
export function createSearchClient(args = {}) {
    return {
        appId: '',
        addAlgoliaAgent: jest.fn(),
        clearCache: jest.fn(),
        initIndex: jest.fn(() => ({
            getObject: jest.fn(() => Promise.resolve({})),
            search: jest.fn(() => Promise.resolve(createSingleSearchResponse())),
        })),
        transporter: {},
        search: jest.fn((requests) => Promise.resolve(createMultiSearchResponse(...requests.map(() => createSingleSearchResponse())))),
        searchForFacetValues: jest.fn(() => Promise.resolve([createSFFVResponse()])),
        ...args,
    };
}
