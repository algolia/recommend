import algoliarecommend from '@algolia/recommend';
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
  TrendingItems,
} from '@algolia/recommend-react';
import React from 'react';

import GridView from './GridView';
import ProductItem from './ProductItem';

const appId = 'XX85YRZZMV';
const apiKey = '098f71f9e2267178bdfc08cc986d2999';
const indexName = 'test_FLAGSHIP_ECOM_recommend';
const recommendClient = algoliarecommend(appId, apiKey);

const App = ({ initialState }) => {
  return (
    <div style={{ margin: '0 auto', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
        Algolia Recommend SSR
      </h2>
      <div style={{ marginTop: '2rem' }}>
        <TrendingItems
          recommendClient={recommendClient}
          indexName={indexName}
          itemComponent={ProductItem}
          maxRecommendations={5}
          view={GridView}
          translations={{
            title: `Trending products`,
          }}
          initialState={initialState}
        />
      </div>

      <div style={{ marginTop: '4rem' }}>
        <RelatedProducts
          recommendClient={recommendClient}
          indexName={indexName}
          objectIDs={['M0E20000000DWIV']}
          itemComponent={ProductItem}
          maxRecommendations={5}
          view={GridView}
          translations={{
            title: 'Related products',
          }}
          initialState={initialState}
        />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <FrequentlyBoughtTogether
          recommendClient={recommendClient}
          indexName={indexName}
          objectIDs={['M0E20000000DWIV']}
          itemComponent={ProductItem}
          maxRecommendations={5}
          view={GridView}
          translations={{
            title: 'Frequently bought together',
          }}
          initialState={initialState}
        />
      </div>
    </div>
  );
};

export default App;
