import algoliarecommend from '@algolia/recommend';
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
} from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';

import algoliasearch from 'algoliasearch';
import React, { Fragment, useState } from 'react';
import insights from 'search-insights';

import { Autocomplete, getAlgoliaResults } from './Autocomplete';
import { Hit } from './Hit';

import './preflight.css';
import '@algolia/autocomplete-theme-classic';
import '@algolia/recommend-theme';
import '@algolia/recommend-theme/dist/HorizontalSlider.css';
import './App.css';
import './Hit.css';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);
const recommendClient = algoliarecommend(appId, apiKey);

insights('init', { appId, apiKey });

function RecommendedItem({ item }) {
  return <Hit hit={item} insights={insights} />;
}

function BundleItem({ item }) {
  return (
    <a
      className="Hit"
      href={item.url}
      onClick={(event) => {
        event.preventDefault();
        insights('clickedObjectIDs', {
          objectIDs: [item.objectID],
          positions: [item.__position],
          eventName: 'Product Clicked',
          queryID: item.__queryID,
          index: item.__indexName,
        });
      }}
    >
      <div className="Hit-Image">
        <img src={item.image_link} alt={item.name} />
      </div>
    </a>
  );
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="demo-container">
      <h1 className="demo-container-title">Algolia Recommend</h1>

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
        <Fragment>
          <div className="demo-selected-product">
            <h2 className="demo-selected-product-title">Selected Product</h2>
            <div className="Hit">
              <div className="Hit-Image">
                <img
                  src={selectedProduct.image_link}
                  alt={selectedProduct.name}
                />
              </div>
              <div className="Hit-Content">
                <div className="Hit-Name">{selectedProduct.name}</div>
                <footer className="Hit-Footer">
                  <span className="Hit-Price">${selectedProduct.price}</span>
                </footer>
              </div>
            </div>
          </div>

          <FrequentlyBoughtTogether
            recommendClient={recommendClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={RecommendedItem}
            maxRecommendations={3}
            classNames={{
              root: 'auc-FBT',
            }}
            queryParameters={{
              analytics: true,
              clickAnalytics: true,
            }}
          />

          <RelatedProducts
            recommendClient={recommendClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={RecommendedItem}
            maxRecommendations={10}
            view={HorizontalSlider}
            translations={{
              title: 'Related products',
            }}
            fallbackParameters={{
              facetFilters: [
                `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
              ],
            }}
            queryParameters={{
              analytics: true,
              clickAnalytics: true,
              facetFilters: [
                `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
              ],
            }}
          />

          <RelatedProducts
            recommendClient={recommendClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={RecommendedItem}
            maxRecommendations={10}
            classNames={{
              root: 'auc-Related',
            }}
            translations={{
              title: 'Related products',
            }}
            fallbackFilters={[
              `hierarchical_categories.lvl3:${selectedProduct.hierarchical_categories.lvl3}`,
            ]}
            queryParameters={{
              analytics: true,
              clickAnalytics: true,
              facetFilters: [
                `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
              ],
            }}
          />
        </Fragment>
      )}
    </div>
  );
}
export default App;
