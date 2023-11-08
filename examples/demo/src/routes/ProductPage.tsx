import algoliarecommend from '@algolia/recommend';
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
  LookingSimilar,
} from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import React from 'react';
import { Navigate } from 'react-router-dom';

import {
  Hit,
  BundleItem,
  BundleView,
  ComparisonChartView,
} from '../components';
import { ComparisonChartItem } from '../components/ComparisonChartItem';
import { apiKey, appId, indexName } from '../config';
import { ProductHit } from '../types';

import { useApplicationContext } from './Root';

const recommendClient = algoliarecommend(appId, apiKey);

export const ProductPage: React.FC = () => {
  const [
    {
      insights,
      selectedProduct,
      setSelectedProduct,
      selectedFacetValue,
      isPersonalisationEnabled,
    },
  ] = useApplicationContext();

  if (!selectedProduct) {
    return <Navigate to="/" />;
  }

  return (
    <>
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
            <div className="Hit-Description">{selectedProduct.objectID}</div>
            <footer className="Hit-Footer">
              <span className="Hit-Price">${selectedProduct.price.value}</span>
            </footer>
          </div>
        </div>
      </div>
      <LookingSimilar<ProductHit>
        indexName={indexName}
        objectIDs={[selectedProduct.objectID]}
        itemComponent={({ item }) => (
          <Hit hit={item} insights={insights} onSelect={setSelectedProduct} />
        )}
        maxRecommendations={10}
        threshold={75}
        view={HorizontalSlider}
        logRegion="eu"
        recommendClient={recommendClient}
        userToken={isPersonalisationEnabled ? 'user-token-1' : undefined}
      />
      <FrequentlyBoughtTogether<ProductHit>
        indexName={indexName}
        objectIDs={[selectedProduct.objectID]}
        logRegion="eu"
        recommendClient={recommendClient}
        userToken={isPersonalisationEnabled ? 'user-token-1' : undefined}
        itemComponent={({ item }) => (
          <BundleItem
            item={item}
            onSelect={setSelectedProduct}
            insights={insights}
          />
        )}
        maxRecommendations={2}
        view={({ itemComponent, items }) => (
          <BundleView
            currentItem={selectedProduct}
            itemComponent={itemComponent}
            items={items}
          />
        )}
        fallbackComponent={() => (
          <RelatedProducts<ProductHit>
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
            logRegion="eu"
            recommendClient={recommendClient}
            userToken={isPersonalisationEnabled ? 'user-token-1' : undefined}
            translations={{
              title: 'Related products (fallback)',
            }}
          />
        )}
      />
      <RelatedProducts<ProductHit>
        indexName={indexName}
        objectIDs={[selectedProduct.objectID]}
        itemComponent={({ item }) => (
          <Hit hit={item} insights={insights} onSelect={setSelectedProduct} />
        )}
        logRegion="eu"
        recommendClient={recommendClient}
        userToken={isPersonalisationEnabled ? 'user-token-1' : undefined}
        maxRecommendations={10}
        view={HorizontalSlider}
        translations={{
          title: 'Related products',
        }}
      />
      <RelatedProducts<ProductHit>
        indexName={indexName}
        objectIDs={[selectedProduct.objectID]}
        logRegion="eu"
        recommendClient={recommendClient}
        userToken={isPersonalisationEnabled ? 'user-token-1' : undefined}
        itemComponent={({ item }) => (
          <ComparisonChartItem
            item={item}
            insights={insights}
            onSelect={setSelectedProduct}
          />
        )}
        maxRecommendations={3}
        view={({ itemComponent, items }) => (
          <ComparisonChartView
            currentItem={selectedProduct}
            itemComponent={itemComponent}
            items={items}
          />
        )}
        translations={{
          title: 'Comparison Chart',
        }}
      />
    </>
  );
};
