# `@algolia/react-recommendations`

React package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/).

## Installation

```sh
yarn add @algolia/react-recommendations@experimental
# or
npm install @algolia/react-recommendations@experimental
```

## API

### `RelatedProducts`

Component to display related products.

#### Usage

```js
import { RelatedProducts } from '@algolia/react-recommendations';
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
    <RelatedProducts
      searchClient={searchClient}
      indexName={indexName}
      objectIDs={[currentObjectID]}
      hitComponent={Hit}
    />
  );
}
```

#### Props

The component accepts all the [shared props](#shared-props) and the following:

##### `hitComponent`

> `({ item }) => JSX.Element` | **required**

The product component to display.

##### `translations`

> `Translations`

```ts
type Translations = {
  title: string;
};
```

##### `children`

> `(props) => JSX.Element`

Render function to modify the default rendering.

### `useRelatedProducts`

> `(props: SharedProps) => { recommendations }`

Hook to retrieve related products.

#### Usage

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

### `FrequentlyBoughtTogether`

Component to display frequently bought together products.

#### Usage

```js
import { FrequentlyBoughtTogether } from '@algolia/react-recommendations';
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
    <FrequentlyBoughtTogether
      searchClient={searchClient}
      indexName={indexName}
      objectIDs={[currentObjectID]}
      hitComponent={Hit}
    />
  );
}
```

#### Props

The component accepts all the [shared props](#shared-props) and the following:

##### `hitComponent`

> `({ item }) => JSX.Element` | **required**

The product component to display.

##### `translations`

> `Translations`

```ts
type Translations = {
  title: string;
};
```

##### `children`

> `(props) => JSX.Element`

Render function to modify the default rendering.

### `useFrequentlyBoughtTogether`

> `(props: Omit<SharedProps, 'fallbackFilters'>) => { recommendations }`

Hook to retrieve frequently bought together products.

#### Usage

```jsx
import { useFrequentlyBoughtTogether } from '@algolia/react-recommendations';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

function App({ currentObjectID }) {
  // ...
  const { recommendations } = useFrequentlyBoughtTogether({
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

### `useRecommendations`

Generic hook to retrieve hits from an AI model.

#### Props

The component accepts all the [shared props](#shared-props) and the following:

##### `model`

> `"related-products" | "bought-together"` | **required**

The name of the Recommendation model to use.

#### Usage

```jsx
import { useRecommendations } from '@algolia/react-recommendations';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

function App({ currentObjectID }) {
  // ...
  const { recommendations } = useRecommendations({
    model: 'related-products',
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

## Shared props

### `searchClient`

> `SearchClient` | **required**

The initialized Algolia search client.

### `indexName`

> `string` | **required**

The name of the products index.

### `objectIDs`

> `string[]` | **required**

An array of `objectID`s of the products to get recommendations from.

### `maxRecommendations`

> `number` | defaults to the maximum number of recommendations available

The number of recommendations to retrieve.

### `fallbackFilters`

> list of strings

Additional filters to use as fallback should there not be enough recommendations.

### `searchParameters`

> [`SearchParameters`](https://www.algolia.com/doc/api-reference/search-api-parameters/) | defaults to `{ analytics: false, enableABTest: false }`

List of [search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/) to send.
