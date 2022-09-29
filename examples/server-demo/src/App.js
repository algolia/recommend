import algoliarecommend from '@algolia/recommend';
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
  TrendingItems,
} from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import React from 'react';

import ProductItem from './ProductItem';

// import '@algolia/ui-components-horizontal-slider-theme';
// import './App.css';
// import './Recommend.css';

const appId = 'XX85YRZZMV';
const apiKey = '098f71f9e2267178bdfc08cc986d2999';
const indexName = 'test_FLAGSHIP_ECOM_recommend';
const recommendClient = algoliarecommend(appId, apiKey);

const App = ({ initialState }) => {
  return (
    <>
      <h2>Algolia Recommend SSR</h2>
      <TrendingItems
        recommendClient={recommendClient}
        indexName={indexName}
        itemComponent={ProductItem}
        maxRecommendations={5}
        view={HorizontalSlider}
        translations={{
          title: `Trending products`,
        }}
        initialState={initialState}
      />

      <RelatedProducts
        recommendClient={recommendClient}
        indexName={indexName}
        objectIDs={['M0E20000000DWIV']}
        itemComponent={ProductItem}
        maxRecommendations={5}
        view={HorizontalSlider}
        translations={{
          title: 'Related products',
        }}
        initialState={initialState}
      />

      <FrequentlyBoughtTogether
        recommendClient={recommendClient}
        indexName={indexName}
        objectIDs={['M0E20000000DWIV']}
        itemComponent={ProductItem}
        maxRecommendations={2}
        view={HorizontalSlider}
        translations={{
          title: 'Frequently bought together',
        }}
        initialState={initialState}
      />
    </>
  );
};

export default App;
