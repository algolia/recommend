import React from 'react';
import { render } from '@testing-library/react';

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

function createSingleSearchResponse(subset) {
  const {
    query = '',
    page = 0,
    hitsPerPage = 20,
    hits = [],
    nbHits = hits.length,
    nbPages = Math.ceil(nbHits / hitsPerPage),
    params = '',
    exhaustiveNbHits = true,
    exhaustiveFacetsCount = true,
    processingTimeMS = 0,
    ...rest
  } = subset;

  return {
    page,
    hitsPerPage,
    nbHits,
    nbPages,
    processingTimeMS,
    hits,
    query,
    params,
    exhaustiveNbHits,
    exhaustiveFacetsCount,
    ...rest,
  };
}

export function createMultiSearchResponse(...args) {
  if (!args.length) {
    return {
      results: [createSingleSearchResponse()],
    };
  }

  return {
    results: args.map(createSingleSearchResponse),
  };
}

function createSearchClient() {
  return {
    initIndex: jest.fn(() => ({
      getObject: jest.fn(() => Promise.resolve(hit)),
    })),
    search: jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map(() => createSingleSearchResponse())
        )
      )
    ),
  };
}

function Hit(props) {
  return props.name;
}

describe('Recommendations', () => {
  test('calls the correct index', () => {
    const searchClient = createSearchClient();
    render(
      <Recommendations
        model="related-products"
        searchClient={searchClient}
        indexName="indexName"
        objectID="objectID"
        hitComponent={Hit}
      />
    );

    expect(searchClient.initIndex).toHaveBeenCalledTimes(1);
    expect(searchClient.initIndex).toHaveBeenCalledWith(
      'ai_recommend_related-products_indexName'
    );
  });
});
