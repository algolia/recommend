import algoliarecommend from '@algolia/recommend';
import { useRelatedProducts, useTrendingItems } from '@algolia/recommend-react';
import React from 'react';

import ProductItem from './ProductItem';

const appId = 'XX85YRZZMV';
const apiKey = '098f71f9e2267178bdfc08cc986d2999';
const indexName = 'test_FLAGSHIP_ECOM_recommend';
const recommendClient = algoliarecommend(appId, apiKey);

const App = ({ initialResult }) => {
  const { recommendations: trendingItems } = useTrendingItems({
    recommendClient,
    indexName,
    maxRecommendations: 3,
    initialResult,
  });

  const { recommendations: relatedProducts } = useRelatedProducts({
    recommendClient,
    indexName,
    objectIDs: ['M0E20000000DWIV'],
    maxRecommendations: 3,
    initialResult,
  });

  const { recommendations: fbtProducts } = useRelatedProducts({
    recommendClient,
    indexName,
    objectIDs: ['M0E20000000DWIV'],
    maxRecommendations: 3,
    initialResult,
  });

  return (
    <div style={{ margin: '0 auto', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
        Algolia Recommend SSR
      </h2>

      <h2>Trending Items</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {trendingItems.map((item) => (
          <ProductItem item={item} key={item.objectID} />
        ))}
      </div>

      <h2 style={{ marginTop: '3rem' }}>Related Products</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {relatedProducts.map((item) => (
          <ProductItem item={item} key={item.objectID} />
        ))}
      </div>

      <h2 style={{ marginTop: '3rem' }}>Frequently Bought Together Products</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {fbtProducts.map((item) => (
          <ProductItem item={item} key={item.objectID} />
        ))}
      </div>
    </div>
  );
};

export default App;
