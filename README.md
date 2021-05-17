# Recommendations

[![MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE) [![npm version](https://img.shields.io/npm/v/@algolia/react-recommendations)](https://www.npmjs.com/package/@algolia/react-recommendations)

This is the repository packaging the Algolia Recommend React component as well as an Algolia Recommend demo.

**During the beta of Algolia Recommend, this React component relies on an Algolia Index to retrieve the recommendations, and performs a regular Search API request to get the recommendations.**

## Installation

```sh
yarn add @algolia/react-recommendations@experimental
# or
npm install @algolia/react-recommendations@experimental
```

## Usage

```js
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
} from '@algolia/react-recommendations';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

function Hit({ hit }) {
  return (
    <pre>
      <code>{JSON.stringify(hit)}</code>
    </pre>
  );
}

function App({ currentObjectID }) {
  // ...

  return (
    <div>
      <FrequentlyBoughtTogether
        searchClient={searchClient}
        indexName={indexName}
        objectIDs={[currentObjectID]}
        itemComponent={Hit}
      />

      <RelatedProducts
        searchClient={searchClient}
        indexName={indexName}
        objectIDs={[currentObjectID]}
        itemComponent={Hit}
      />
    </div>
  );
}
```

If you want full control of the rendering, you can use the `useRelatedProducts` and `useFrequentlyBoughtTogether` React hooks:

```jsx
import { useRelatedProducts } from '@algolia/react-recommendations';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

function App({ currentObjectID }) {
  // ...
  const { recommendations } = useRelatedProducts({
    searchClient,
    indexName,
    objectIDs: [currentObjectID],
  });

  return (
    <div className="auc-Recommendations">
      {recommendations.length > 0 && (
        <ol className="auc-Recommendations-list">
          {recommendations.map((recommendation) => (
            <li
              key={recommendation.objectID}
              className="auc-Recommendations-item"
            >
              <pre>
                <code>{JSON.stringify(hit)}</code>
              </pre>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
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

### `objectIDs`

> `string[]` | **required**

An array of `objectID`s of the products to get recommendations from.

### `itemComponent`

> `function` | **required**

The product component to display.

### `maxRecommendations`

> `number` | defaults to the maximum number of recommendations available

The number of recommendations to retrieve.

### `fallbackFilters`

> list of strings

Additional filters to use as fallback should there not be enough recommendations.

### `searchParameters`

> [`SearchParameters`](https://www.algolia.com/doc/api-reference/search-api-parameters/) | defaults to `{ analytics: false, enableABTest: false }`

List of [search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/) to send.

## License

[MIT](LICENSE)
