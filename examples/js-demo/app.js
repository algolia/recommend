/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import {
  frequentlyBoughtTogether,
  relatedProducts,
} from '@algolia/js-recommendations';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';
import insights from 'search-insights';

import '@algolia/autocomplete-theme-classic';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for a product',
  openOnFocus: true,
  defaultActiveItemId: 0,
  getSources({ query }) {
    return [
      {
        sourceId: 'suggestions',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName,
                query,
                params: {
                  hitsPerPage: 5,
                },
              },
            ],
          });
        },
        getItemInputValue({ item }) {
          return item.name;
        },
        onSelect({ item }) {
          renderRecommendations(item);
        },
        templates: {
          item({ item, components }) {
            return (
              <div className="aa-ItemWrapper">
                <div className="aa-ItemContent">
                  <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
                    <img
                      src={item.image_link}
                      alt={item.name}
                      width="40"
                      height="40"
                    />
                  </div>

                  <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
                      <components.Highlight hit={item} attribute="name" />
                    </div>
                    <div className="aa-ItemContentDescription">
                      In <strong>{item.category}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        },
      },
    ];
  },
});

function renderRecommendations(item) {
  frequentlyBoughtTogether({
    container: '#frequentlyBoughtTogether',
    searchClient,
    indexName,
    objectID: item.objectID,
    hitComponent({ hit }) {
      return <Hit hit={hit} insights={insights} />;
    },
    maxRecommendations: 3,
    searchParameters: {
      analytics: true,
      clickAnalytics: true,
    },
  });

  relatedProducts({
    container: '#relatedProducts',
    searchClient,
    indexName,
    objectID: item.objectID,
    hitComponent({ hit }) {
      return <Hit hit={hit} insights={insights} />;
    },
    maxRecommendations: 10,
    translations: {
      title: 'Related products (inline)',
    },
    fallbackFilters: [
      `hierarchical_categories.lvl2:${item.hierarchical_categories.lvl2}`,
    ],
    searchParameters: {
      analytics: true,
      clickAnalytics: true,
      facetFilters: [
        `hierarchical_categories.lvl0:${item.hierarchical_categories.lvl0}`,
      ],
    },
  });
}

function Hit({ hit, insights }) {
  return (
    <div className="RecommendationItem">
      <div className="RecommendationItemImage">
        <img src={hit.image_link} alt={hit.name} />
      </div>

      <div>
        <div className="RecommendationItemName">{hit.name}</div>
        <div className="RecommendationItemDescription">
          <p>
            {hit.objectID} (score: {hit.__recommendScore})
          </p>
        </div>
        <div className="RecommendationItemPrice">${hit.price}</div>
      </div>

      <div>
        <button
          onClick={() =>
            insights('clickedObjectIDsAfterSearch', {
              objectIDs: [hit.objectID],
              eventName: 'Product Clicked',
              queryID: hit.__queryID,
              index: hit.__indexName,
            })
          }
        >
          See details
        </button>
        <button
          onClick={() =>
            insights('convertedObjectIDsAfterSearch', {
              objectIDs: [hit.objectID],
              eventName: 'Product Added To Cart',
              queryID: hit.__queryID,
              index: hit.__indexName,
            })
          }
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
