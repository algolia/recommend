/** @jsxRuntime classic */
/** @jsx h */
import algoliarecommend from '@algolia/recommend';
import {
  frequentlyBoughtTogether,
  lookingSimilar,
  relatedProducts,
  trendingFacets,
  trendingItems,
} from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';
import { h } from 'preact';

import { ProductHit } from '../types/ProductHit';

import { ProductItem } from './ProductItem';

const indexName = 'test_FLAGSHIP_ECOM_recommend';

const recommendClient = algoliarecommend(
  'XX85YRZZMV',
  '098f71f9e2267178bdfc08cc986d2999'
);

frequentlyBoughtTogether<ProductHit>({
  container: '#frequentlyBoughtTogether',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  itemComponent({ item }) {
    return <ProductItem item={item} />;
  },
});

relatedProducts<ProductHit>({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  view: (...props) => horizontalSlider(...props) || <div>Loading</div>,
  objectIDs: ['M0E20000000EAAK'],
  itemComponent({ item }) {
    return <ProductItem item={item} />;
  },
});

lookingSimilar<ProductHit>({
  container: '#lookingSimilar',
  recommendClient,
  indexName,
  view: (...props) => horizontalSlider(...props) || <div>Loading</div>,
  objectIDs: ['M0E20000000EAAK'],
  itemComponent({ item }) {
    return <ProductItem item={item} />;
  },
});

trendingItems<ProductHit>({
  container: '#trendingItems',
  recommendClient,
  indexName,
  view: (...props) => horizontalSlider(...props) || <div>Loading</div>,
  itemComponent({ item }) {
    return <ProductItem item={item} />;
  },
});

trendingFacets<ProductHit>({
  container: '#trendingFacets',
  recommendClient,
  indexName,
  facetName: 'brand',
  maxRecommendations: 5,
  itemComponent({ item }) {
    return <p>{item.facetValue}</p>;
  },
});
