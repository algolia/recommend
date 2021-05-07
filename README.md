# @algolia/react-recommendations

[![MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE) [![npm version](https://img.shields.io/npm/v/@algolia/react-recommendations)](https://www.npmjs.com/package/@algolia/react-recommendations)

This is the repository packaging the Algolia Recommend React component as well as an Algolia Recommend demo.

**During the beta of Algolia Recommend, this React component relies on an Algolia Index to retrieve the recommendations, and performs a regular Search API request to get the recommendations.**

## Installation

```sh
yarn add @algolia/react-recommendations@beta
# or
npm install @algolia/react-recommendations@beta
```

## Usage

First, you need to import the package.

```js
import { Recommendations } from '@algolia/react-recommendations';
```

Then, use the `Recommendations` component:

```jsx
// Related products:
<Recommendations
  model="related-products"
  searchClient={searchClient}
  indexName="YOUR_SOURCE_INDEX_NAME"
  objectID={objectID}
  hitComponent={Hit}
/>

// Bought together:
<Recommendations
  model="bought-together"
  searchClient={searchClient}
  indexName="YOUR_SOURCE_INDEX_NAME"
  objectID={objectID}
  hitComponent={Hit}
/>
```

## Props

### `model`

> `"related-product" | "bought-together"` | **required**

The name of the Recommendation model to use.

### `searchClient`

> `SearchClient` | **required**

The initialized Algolia search client.

### `indexName`

> `string` | **required**

The name of the products index.

### `objectID`

> `string` | **required**

The objectID of the product to get recommendations from

### `hitComponent`

> `function` | **required**

The product component to display.

### `maxRecommendations`

> `number` | defaults to the maximum number of recommendations available

The number of recommendations to retrieve.

### `facetFilters`

> list of strings

Additional [facet filters](https://www.algolia.com/doc/api-reference/api-parameters/facetFilters/?client=javascript) to forward.

### `fallbackFilters`

> list of strings

Additional filters to use as fallback should there not be enough recommendations.

### `analytics`

> `boolean` | defaults to `false`

Whether you want [Search Analytics](https://www.algolia.com/doc/api-reference/api-parameters/analytics/?client=javascript) to be enabled.

### `clickAnalytics`

> `boolean` | defaults to `false`

Whether you want [Click Analytics](https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/?client=javascript) to be enabled.

## Development

To run this project locally, install the dependencies and run the local server:

```sh
yarn
yarn start
```

Open http://localhost:3000 to see your app.

## License

[MIT](LICENSE)
