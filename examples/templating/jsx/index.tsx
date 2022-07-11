/** @jsx h */
import algoliarecommend from '@algolia/recommend';
import {
  frequentlyBoughtTogether,
  relatedProducts,
  trendingFacets,
  trendingItems,
} from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';
import { h } from 'preact';

import { ProductHit } from '../types/ProductHit';

import { RelatedItem } from './RelatedItem';

const appId = 'XX85YRZZMV';
const apiKey = '098f71f9e2267178bdfc08cc986d2999';
const indexName = 'test_FLAGSHIP_ECOM_recommend';

const recommendClient = algoliarecommend(appId, apiKey);

frequentlyBoughtTogether<ProductHit>({
  container: '#frequentlyBoughtTogether',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  itemComponent({ item }) {
    return <RelatedItem item={item} />;
  },
});

relatedProducts<ProductHit>({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  view: horizontalSlider,
  objectIDs: ['M0E20000000EAAK'],
  itemComponent({ item }) {
    return <RelatedItem item={item} />;
  },
});

trendingItems<ProductHit>({
  container: '#trendingItems',
  recommendClient,
  indexName,
  view: horizontalSlider,
  itemComponent({ item }) {
    return <RelatedItem item={item} />;
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
