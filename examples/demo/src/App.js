import {
  FrequentlyBoughtTogether,
  RelatedProducts,
  RelatedProductsSlider,
} from '@algolia/react-recommendations';
import algoliasearch from 'algoliasearch';
import React, { useState } from 'react';
import insights from 'search-insights';

import '@algolia/autocomplete-theme-classic';

import config from '../demo.config';

import { Autocomplete, getAlgoliaResults } from './Autocomplete';
import { Hit } from './Hit';

import './App.css';

const {
  appId,
  apiKey,
  indexName,
  nameAttribute,
  imageAttribute,
  categoryAttribute,
  priceAttribute,
  fallbackFilter,
} = config;

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
                return item[nameAttribute];
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
                            src={item[imageAttribute]}
                            alt={item[nameAttribute]}
                            width="40"
                            height="40"
                          />
                        </div>

                        <div className="aa-ItemContentBody">
                          <div className="aa-ItemContentTitle">
                            <components.Highlight
                              hit={item}
                              attribute={nameAttribute}
                            />
                          </div>
                          <div className="aa-ItemContentDescription">
                            In <strong>{item[categoryAttribute]}</strong>
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
                  src={selectedProduct[imageAttribute]}
                  alt={selectedProduct[nameAttribute]}
                />
              </div>

              <div className="Hit-Content">
                <div className="Hit-Name">{selectedProduct[nameAttribute]}</div>
                <div className="Hit-Description">
                  {selectedProduct.objectID}
                </div>
                <footer className="Hit-Footer">
                  <span className="Hit-Price">
                    ${selectedProduct[priceAttribute]}
                  </span>
                </footer>
              </div>
            </div>
          </div>

          <FrequentlyBoughtTogether
            searchClient={searchClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            hitComponent={({ hit }) => <Hit hit={hit} insights={insights} />}
            maxRecommendations={3}
            searchParameters={{
              analytics: false,
              clickAnalytics: false,
            }}
          />

          <RelatedProductsSlider
            searchClient={searchClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            hitComponent={({ hit }) => <Hit hit={hit} insights={insights} />}
            maxRecommendations={10}
            translations={{
              title: 'Related products (slider)',
            }}
            fallbackFilters={[
              `${fallbackFilter}:${selectedProduct[fallbackFilter]}`,
            ]}
            searchParameters={{
              analytics: false,
              clickAnalytics: false,
            }}
          />

          <RelatedProducts
            searchClient={searchClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            hitComponent={({ hit }) => <Hit hit={hit} insights={insights} />}
            maxRecommendations={10}
            translations={{
              title: 'Related products',
            }}
            fallbackFilters={[
              `${fallbackFilter}:${selectedProduct[fallbackFilter]}`,
            ]}
            searchParameters={{
              analytics: false,
              clickAnalytics: false,
            }}
          />
        </>
      )}
    </div>
  );
}
export default App;
