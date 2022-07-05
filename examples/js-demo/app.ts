/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliarecommend from '@algolia/recommend';
import {
  frequentlyBoughtTogether,
  relatedProducts,
} from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';
import algoliasearch from 'algoliasearch';
import { render, createElement } from 'preact';
import insights from 'search-insights';

import '@algolia/autocomplete-theme-classic';
import '@algolia/ui-components-horizontal-slider-theme';

import { relatedItem } from './relatedItem';
import { ProductHit, ReferenceItemProps } from './types';

const appId = 'XX85YRZZMV';
const apiKey = '098f71f9e2267178bdfc08cc986d2999';
const indexName = 'test_FLAGSHIP_ECOM_recommend';

const searchClient = algoliasearch(appId, apiKey);
const recommendClient = algoliarecommend(appId, apiKey);

insights('init', { appId, apiKey });
insights('setUserToken', 'user-token-1');

function updateReferenceItem(item: ProductHit) {
  render(referenceItem({ item }), document.querySelector('#referenceHit'));
  renderRecommendations(item);
}

autocomplete<ProductHit>({
  container: '#autocomplete',
  placeholder: 'Search for a product',
  openOnFocus: true,
  defaultActiveItemId: 0,
  getSources({ query }) {
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
          updateReferenceItem(item);
        },
        templates: {
          item({ item, components, createElement, Fragment }) {
            return createElement('div', { className: 'aa-ItemWrapper' }, [
              createElement('div', { className: 'aa-ItemContent' }, [
                createElement(
                  'div',
                  {
                    className:
                      'aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop',
                  },
                  [
                    createElement(
                      'img',
                      {
                        src: item.image_urls[0],
                        alt: item.name,
                        width: 40,
                        height: 40,
                      },
                      null
                    ),
                  ]
                ),
                createElement('div', { className: 'aa-ItemContentBody' }, [
                  createElement(
                    'div',
                    { className: 'aa-ItemContentTitle' },
                    createElement(
                      components.Highlight,
                      { hit: item, attribute: 'name' },
                      null
                    )
                  ),
                  createElement(
                    'div',
                    { className: 'aa-ItemContentDescription' },
                    [
                      createElement(Fragment, null, 'In '),
                      createElement('strong', null, item.brand),
                    ]
                  ),
                ]),
              ]),
            ]);
          },
        },
      },
    ];
  },
});

function referenceItem({ item }: ReferenceItemProps) {
  return createElement(
    'div',
    {
      className: 'my-2 grid gap-4',
      style: {
        gridTemplateColumns: '150px 1fr',
      },
    },
    [
      createElement(
        'img',
        {
          src: item.image_urls[0],
          alt: item.name,
          className: 'max-w-full',
        },
        null
      ),
      createElement('div', {}, [
        createElement(
          'div',
          { className: 'text-sm text-gray-500' },
          item.brand
        ),
        createElement(
          'div',
          { className: 'text-gray-900 font-semibold mb-1 whitespace-normal' },
          item.name
        ),
        createElement(
          'div',
          { className: 'my-2 font-semibold text-gray-800' },
          `$${item.price.value}`
        ),
      ]),
    ]
  );
}

function renderRecommendations(selectedProduct: ProductHit) {
  frequentlyBoughtTogether<ProductHit>({
    container: '#frequentlyBoughtTogether',
    recommendClient,
    indexName,
    objectIDs: [selectedProduct.objectID],
    itemComponent({ item, createElement }) {
      return relatedItem(item, createElement);
    },
    maxRecommendations: 3,
    queryParameters: {
      analytics: true,
      clickAnalytics: true,
    },
    fallbackComponent() {
      return relatedProducts({
        recommendClient,
        indexName,
        objectIDs: [selectedProduct.objectID],
        temComponent: relatedItem,
        view({ items, createElement }) {
          return horizontalSlider({
            container: '#relatedProducts-slider',
            items,
            itemComponent: ({ item }) => {
              return relatedItem(item, createElement);
            },
          });
        },
        maxRecommendations: 10,
        translations: {
          title: 'Related products (fallback)',
        },
        fallbackParameters: {
          facetFilters: [
            `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
          ],
        },
        queryParameters: {
          analytics: true,
          clickAnalytics: true,
          facetFilters: [
            `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
          ],
        },
      });
    },
  });

  relatedProducts<ProductHit>({
    container: '#relatedProducts',
    recommendClient,
    indexName,
    objectIDs: [selectedProduct.objectID],
    itemComponent({ item, createElement }) {
      return relatedItem(item, createElement);
    },
    view({ items, itemComponent, Fragment, createElement }) {
      return horizontalSlider({
        container: '#relatedProducts-slider',
        items,
        itemComponent: ({ item }) => {
          return itemComponent({ item, createElement, Fragment });
        },
      });
    },
    maxRecommendations: 10,
    translations: {
      title: 'Related products',
    },
    fallbackParameters: {
      facetFilters: [
        `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
      ],
    },
    queryParameters: {
      analytics: true,
      clickAnalytics: true,
      facetFilters: [
        `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
      ],
    },
  });
}
