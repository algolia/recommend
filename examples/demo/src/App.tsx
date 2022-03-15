import algoliarecommend from '@algolia/recommend';
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
  TrendingItems,
  TrendingFacets,
} from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import algoliasearch from 'algoliasearch';
import React, { Fragment, useState } from 'react';
import insights from 'search-insights';

import { Autocomplete, getAlgoliaResults } from './Autocomplete';
import { BundleView } from './BundleView';
import { Facet } from './Facet';
import { Hit } from './Hit';
import { ProductHit, BundleItemProps, FacetHit } from './types';

import '@algolia/autocomplete-theme-classic';
import '@algolia/ui-components-horizontal-slider-theme';
import './App.css';
import './Recommend.css';

const appId = '';
const apiKey = '';
const indexName = '';

const searchClient = algoliasearch(appId, apiKey);
const recommendClient = algoliarecommend(appId, apiKey);

insights('init', { appId, apiKey });
insights('setUserToken', 'user-token-1');

function BundleItem({ item, onSelect }: BundleItemProps<ProductHit>) {
  return (
    <a
      className="Hit Hit-link"
      href={item.url}
      onClick={(event) => {
        event.preventDefault();

        onSelect(item);
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
        <img src={item.image_urls[0]} alt={item.name} />
      </div>
    </a>
  );
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState<ProductHit | null>(
    null
  );

  const [selectedFacetValue, setSelectedFacetValue] = useState<FacetHit | null>(
    null
  );

  return (
    <div className="container">
      <h1>Algolia Recommend</h1>

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
                            src={item.image_urls[0]}
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
                            In <strong>{item.brand}</strong>
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
          <div style={{ padding: '1rem 0' }}>
            <div
              className="Hit"
              style={{ gridTemplateColumns: '150px 1fr', gap: '1rem' }}
            >
              <div className="Hit-Image" style={{ maxWidth: 150 }}>
                <img
                  src={selectedProduct.image_urls[0]}
                  alt={selectedProduct.name}
                />
              </div>

              <div className="Hit-Content">
                <div className="Hit-Name">{selectedProduct.name}</div>
                <div className="Hit-Description">
                  {selectedProduct.objectID}
                </div>
                <footer className="Hit-Footer">
                  <span className="Hit-Price">
                    ${selectedProduct.price.value}
                  </span>
                </footer>
              </div>
            </div>
          </div>
          <FrequentlyBoughtTogether<ProductHit>
            recommendClient={recommendClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={({ item }) => (
              <BundleItem item={item} onSelect={setSelectedProduct} />
            )}
            maxRecommendations={2}
            queryParameters={{
              analytics: true,
              clickAnalytics: true,
              facetFilters: selectedFacetValue
                ? [`brand:${selectedFacetValue}`]
                : null,
            }}
            view={({ itemComponent, items }) => (
              <BundleView
                currentItem={selectedProduct}
                itemComponent={itemComponent}
                items={items}
              />
            )}
            fallbackComponent={() => (
              <RelatedProducts<ProductHit>
                recommendClient={recommendClient}
                indexName={indexName}
                objectIDs={[selectedProduct.objectID]}
                itemComponent={({ item }) => (
                  <Hit
                    hit={item}
                    insights={insights}
                    onSelect={setSelectedProduct}
                  />
                )}
                view={HorizontalSlider}
                maxRecommendations={10}
                translations={{
                  title: 'Related products (fallback)',
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
            )}
          />
          <RelatedProducts<ProductHit>
            recommendClient={recommendClient}
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={({ item }) => (
              <Hit
                hit={item}
                insights={insights}
                onSelect={setSelectedProduct}
              />
            )}
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
                selectedFacetValue ? `brand:${selectedFacetValue}` : null,
              ],
            }}
          />

          <TrendingFacets<FacetHit>
            recommendClient={recommendClient}
            indexName={indexName}
            facetName="brand"
            itemComponent={({ item }) => (
              <Facet
                hit={item}
                insights={insights}
                onSelect={setSelectedFacetValue}
                indexName={indexName}
              />
            )}
            maxRecommendations={5}
            translations={{
              title: 'Trending in brand',
            }}
          />
          <TrendingItems<ProductHit>
            recommendClient={recommendClient}
            indexName={indexName}
            itemComponent={({ item }) => (
              <Hit
                hit={item}
                insights={insights}
                onSelect={setSelectedProduct}
              />
            )}
            maxRecommendations={10}
            view={HorizontalSlider}
            translations={{
              title: 'Trending products',
            }}
          />
        </Fragment>
      )}
    </div>
  );
}
export default App;
