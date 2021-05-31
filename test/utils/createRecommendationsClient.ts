import { createMultiSearchResponse, createSearchClient } from '.';

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

export function createRecommendationsClient() {
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
