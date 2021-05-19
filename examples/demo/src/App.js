import {
  FrequentlyBoughtTogether,
  RelatedProducts,
} from '@algolia/react-recommendations';
import { HorizontalSlider } from '@algolia/ui-components-react-horizontal-slider';
import algoliasearch from 'algoliasearch';
import React, { useState } from 'react';
import insights from 'search-insights';

import '@algolia/autocomplete-theme-classic';

import { Autocomplete, getAlgoliaResults } from './Autocomplete';
import { Hit } from './Hit';

import '@algolia/ui-components-react-horizontal-slider/HorizontalSlider.css';
import './App.css';
import './Recommendations.css';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

insights('init', { appId, apiKey });

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="container">
      <h1>Algolia Recommendations</h1>

      <Autocomplete
        placeholder="Search for a product"
        openOnFocus={true}
        defaultActiveItemId={0}
        getSources={({ query }) => {
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
                setSelectedProduct(item);
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
        }}
      />

      {selectedProduct && (
        <>
          <div style={{ padding: '1rem 0' }}>
            <div
              className="Hit"
              style={{ gridTemplateColumns: '150px 1fr', gap: '1rem' }}
            >
              <div className="Hit-Image" style={{ maxWidth: 150 }}>
                <img
                  src={selectedProduct.image_link}
                  alt={selectedProduct.name}
                />
              </div>

              <div className="Hit-Content">
                <div className="Hit-Name">{selectedProduct.name}</div>
                <div className="Hit-Description">
                  {selectedProduct.objectID}
                </div>
                <footer className="Hit-Footer">
                  <span className="Hit-Price">${selectedProduct.price}</span>
                </footer>
              </div>
            </div>
          </div>

          <FrequentlyBoughtTogether
            searchClient={searchClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={({ item }) => <Hit hit={item} insights={insights} />}
            maxRecommendations={3}
            searchParameters={{
              analytics: true,
              clickAnalytics: true,
            }}
          />

          <RelatedProducts
            searchClient={searchClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={({ item }) => <Hit hit={item} insights={insights} />}
            view={HorizontalSlider}
            maxRecommendations={10}
            translations={{
              title: 'Related products (slider)',
            }}
            fallbackFilters={[
              `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
            ]}
            searchParameters={{
              analytics: true,
              clickAnalytics: true,
              facetFilters: [
                `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
              ],
            }}
          />

          <RelatedProducts
            searchClient={searchClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={({ item }) => <Hit hit={item} insights={insights} />}
            maxRecommendations={10}
            translations={{
              title: 'Related products',
            }}
            fallbackFilters={[
              `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
            ]}
            searchParameters={{
              analytics: true,
              clickAnalytics: true,
              facetFilters: [
                `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
              ],
            }}
          />
        </>
      )}
    </div>
  );
}
export default App;
