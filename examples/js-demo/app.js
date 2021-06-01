/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import {
  frequentlyBoughtTogether,
  relatedProducts,
} from '@algolia/recommendations-js';
import algoliasearch from 'algoliasearch';
import { h, render } from 'preact';
import insights from 'search-insights';

import '@algolia/autocomplete-theme-classic';
import '@algolia/ui-components-js-horizontal-slider/HorizontalSlider.css';
import { Hit } from './Hit';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

insights('init', { appId, apiKey });

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
          render(hitShowcase(item), document.querySelector('#hitShowcase'));
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

function hitShowcase(selectedProduct) {
  return (
    <div style={{ padding: '1rem 0' }}>
      <div
        className="Hit"
        style={{ gridTemplateColumns: '150px 1fr', gap: '1rem' }}
      >
        <div className="Hit-Image" style={{ maxWidth: 150 }}>
          <img src={selectedProduct.image_link} alt={selectedProduct.name} />
        </div>

        <div className="Hit-Content">
          <div className="Hit-Name">{selectedProduct.name}</div>
          <div className="Hit-Description">{selectedProduct.objectID}</div>
          <footer className="Hit-Footer">
            <span className="Hit-Price">${selectedProduct.price}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function renderRecommendations(selectedProduct) {
  frequentlyBoughtTogether({
    container: '#frequentlyBoughtTogether',
    searchClient,
    indexName,
    objectIDs: [selectedProduct.objectID],
    itemComponent({ item }) {
      return <Hit hit={item} insights={insights} />;
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
    objectIDs: [selectedProduct.objectID],
    itemComponent({ item }) {
      return <Hit hit={item} insights={insights} />;
    },
    maxRecommendations: 10,
    translations: {
      title: 'Related products',
    },
    fallbackFilters: [
      `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
    ],
    searchParameters: {
      analytics: true,
      clickAnalytics: true,
      facetFilters: [
        `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
      ],
    },
  });
}
