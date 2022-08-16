import algoliarecommend from '@algolia/recommend';
import {
  frequentlyBoughtTogether,
  relatedProducts,
  trendingFacets,
  trendingItems,
} from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';

import { ProductHit } from '../types/ProductHit';

import { productItem } from './productItem';

import '@algolia/ui-components-horizontal-slider-theme';

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
  headerComponent: ({ html }) => html`<h3>Frequently bought together</h3>`,
  itemComponent: productItem,
});

relatedProducts<ProductHit>({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  headerComponent: ({ html }) => html`<h3>Related products</h3>`,
  itemComponent: productItem,
  view({ items, itemComponent, html, createElement, Fragment }) {
    return horizontalSlider({
      items,
      itemComponent({ item }) {
        return itemComponent({ item, html, createElement, Fragment });
      },
    });
  },
});

trendingItems<ProductHit>({
  container: '#trendingItems',
  recommendClient,
  indexName,
  headerComponent: ({ html }) => html`<h3>Trending items</h3>`,
  itemComponent: productItem,
  view({ items, itemComponent, html, createElement, Fragment }) {
    return horizontalSlider({
      items,
      itemComponent({ item }) {
        return itemComponent({ item, html, createElement, Fragment });
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
  headerComponent: ({ html }) => html`<h3>Trending facets</h3>`,
  itemComponent({ item, html }) {
    return html`<p>${item.facetValue}</p>`;
  },
});
