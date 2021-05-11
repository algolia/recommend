import {
  FrequentlyBoughtTogether,
  RelatedProducts,
} from '@algolia/react-recommendations';
import algoliasearch from 'algoliasearch';
import React, { useState } from 'react';
import insights from 'search-insights';

import '@algolia/autocomplete-theme-classic';

import { Autocomplete, getAlgoliaResults } from './Autocomplete';
import { Hit } from './Hit';

import './App.css';

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
          <FrequentlyBoughtTogether
            searchClient={searchClient}
            indexName={indexName}
            objectID={selectedProduct.objectID}
            hitComponent={({ hit }) => <Hit hit={hit} insights={insights} />}
            maxRecommendations={3}
            searchParameters={{
              analytics: true,
              clickAnalytics: true,
            }}
          />

          <RelatedProducts
            searchClient={searchClient}
            indexName={indexName}
            objectID={selectedProduct.objectID}
            hitComponent={({ hit }) => <Hit hit={hit} insights={insights} />}
            maxRecommendations={5}
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
