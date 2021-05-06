import React, { Component, useState } from 'react';
import {
  InstantSearch,
  Configure,
  connectHitInsights,
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch';
import { Recommendations } from './Recommendations.js';
import { Autocomplete, getAlgoliaResults } from './Autocomplete';

import './App.css';

const aa = require('search-insights');

aa('init', {
  appId: 'HYDY1KWTWB',
  apiKey: '28cf6d38411215e2eef188e635216508',
});

const searchClient = algoliasearch(
  'HYDY1KWTWB',
  '28cf6d38411215e2eef188e635216508'
);

const RecoHitsWithInsights = ({ hit, insights }) => {
  return (
    <div>
      <img src={hit.image_link} align="left" alt={hit.name} width={100} />
      <div className="hit-name">{hit.name}</div>
      <div className="hit-objectID">
        <p>
          {hit.objectID} (score={hit._recommendScore})
        </p>
      </div>
      <div className="hit-price">${hit.price}</div>
      <button
        onClick={() =>
          insights('clickedObjectIDsAfterSearch', {
            eventName: 'Product Clicked',
          })
        }
      >
        See details
      </button>
      <button
        onClick={() =>
          insights('convertedObjectIDsAfterSearch', {
            eventName: 'Product Added To Cart',
          })
        }
      >
        Add to cart
      </button>
    </div>
  );
};

const HitWithInsights = connectHitInsights(aa)(RecoHitsWithInsights);

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="ais-InstantSearch">
      <h1>React InstantSearch Algolia Recommend Demo</h1>
      <h3>Looking for Recommendations?</h3>

      <Autocomplete
        placeholder="Search for a product"
        openOnFocus={true}
        getSources={({ query }) => {
          return [
            {
              sourceId: 'suggestions',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: 'gstar_demo_test',
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
          <Recommendations
            model="bought-together"
            searchClient={searchClient}
            indexName="gstar_demo_test"
            objectID={selectedProduct.objectID}
            hitComponent={HitWithInsights}
            maxRecommendations={3}
            clickAnalytics={true}
            analytics={true}
          >
            {({ recommendations, children }) => {
              if (recommendations.length === 0) {
                return null;
              }

              return (
                <>
                  <h3>Frequently Bought Together</h3>
                  {children}
                </>
              );
            }}
          </Recommendations>

          <Recommendations
            model="related-products"
            searchClient={searchClient}
            indexName={'gstar_demo_test'}
            objectID={selectedProduct.objectID}
            hitComponent={HitWithInsights}
            maxRecommendations={5}
            facetFilters={[
              `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
            ]}
            fallbackFilters={[
              `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
            ]}
            clickAnalytics={true}
            analytics={true}
          >
            {({ recommendations, children }) => {
              if (recommendations.length === 0) {
                return null;
              }

              return (
                <>
                  <h3>Related Products</h3>
                  {children}
                </>
              );
            }}
          </Recommendations>
        </>
      )}
    </div>
  );
}
export default App;
