import algoliarecommend from '@algolia/recommend';
import {
  frequentlyBoughtTogether,
  relatedProducts,
  trendingFacets,
  trendingItems,
} from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';

import { ProductHit } from '../types/ProductHit';

import { relatedItem } from './relatedItem';

import '@algolia/ui-components-horizontal-slider-theme';

const appId = 'XX85YRZZMV';
const apiKey = '098f71f9e2267178bdfc08cc986d2999';
const indexName = 'test_FLAGSHIP_ECOM_recommend';

const recommendClient = algoliarecommend(appId, apiKey);

frequentlyBoughtTogether<ProductHit>({
  container: '#frequentlyBoughtTogether',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Frequently bought together'),
  itemComponent({ item, createElement }) {
    return relatedItem(item, createElement);
  },
});

relatedProducts<ProductHit>({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Related products'),
  itemComponent({ item, createElement }) {
    return relatedItem(item, createElement);
  },
  view({ items, createElement, Fragment, itemComponent }) {
    return horizontalSlider({
      container: '#relatedProducts-slider',
      items,
      itemComponent: ({ item }) => {
        return itemComponent({ item, createElement, Fragment });
      },
    });
  },
});

trendingItems<ProductHit>({
  container: '#trendingItems',
  recommendClient,
  indexName,
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Trending items'),
  itemComponent({ item, createElement }) {
    return relatedItem(item, createElement);
  },
  view({ items, itemComponent, Fragment, createElement }) {
    return horizontalSlider({
      container: '#trendingItems-slider',
      items,
      itemComponent: ({ item }) => {
        return itemComponent({ item, createElement, Fragment });
      },
    });
  },
});

trendingFacets({
  container: '#trendingFacets',
  recommendClient,
  indexName,
  facetName: 'brand',
  maxRecommendations: 5,
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Trending facets'),
  itemComponent({ item, createElement }) {
    return createElement('p', null, item.facetValue);
  },
});
