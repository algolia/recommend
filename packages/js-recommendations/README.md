# `@algolia/js-recommendations`

JavaScript package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/).

## Installation

```sh
yarn add @algolia/js-recommendations@experimental
# or
npm install @algolia/js-recommendations@experimental
```

## API

### `relatedProducts`

Function to render related products.

#### Usage

To get started, you need a container for your results to go in. If you don’t have one already, you can insert one into your markup:

```html
<div id="relatedProducts"></div>
```

Then, inject results into it by calling the `relatedProducts` function and providing the [`container`](#container). It can be a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

```js
/** @jsx h */

import { h } from 'preact';
import { relatedProducts } from '@algolia/js-recommendations';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);
const currentObjectID = 'fff4851ec9c8ca4e771b87b3fcdd9953b55c64df';

relatedProducts({
  container: '#relatedProducts',
  searchClient,
  indexName,
  objectIDs: [currentObjectID],
  itemComponent({ item }) {
    return (
      <pre>
        <code>{JSON.stringify(item)}</code>
      </pre>
    );
  },
});
```

#### Props

The function accepts all the [shared props](#shared-props) and the following:

##### `container`

> `string | HTMLElement` | **required**

The container for the `relatedProducts` component. You can either pass a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

##### `itemComponent`

> `({ item }) => JSX.Element` | **required**

The product component to display.

##### `translations`

> `RecommendationTranslations`

<details>

<summary><code>RecommendationTranslations</code></summary>

```ts
type RecommendationTranslations = Partial<{
  title: string;
  showMore: string;
}>;
```

</details>

##### `children`

> `(props: ChildrenProps) => JSX.Element`

<details>

<summary><code>ChildrenProps</code></summary>

```ts
type ChildrenProps<TObject> = {
  recommendations: TObject[];
  View(props: unknown): JSX.Element;
  translations: RecommendationTranslations;
};
```

</details>

Render function to modify the default rendering.

The default implementation is:

```js
function defaultRender(props) {
  if (props.recommendations.length === 0) {
    return null;
  }

  return (
    <section className="auc-Recommendations">
      {props.translations.title && <h3>{props.translations.title}</h3>}

      <props.View />
    </section>
  );
}
```

### `frequentlyBoughtTogether`

Function to render frequently bought together products.

#### Usage

To get started, you need a container for your results to go in. If you don’t have one already, you can insert one into your markup:

```html
<div id="frequentlyBoughtTogether"></div>
```

Then, inject results into it by calling the `frequentlyBoughtTogether` function and providing the [`container`](#container). It can be a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

```js
/** @jsx h */

import { h } from 'preact';
import { frequentlyBoughtTogether } from '@algolia/js-recommendations';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);
const currentObjectID = 'fff4851ec9c8ca4e771b87b3fcdd9953b55c64df';

frequentlyBoughtTogether({
  container: '#frequentlyBoughtTogether',
  searchClient,
  indexName,
  objectIDs: [currentObjectID],
  itemComponent({ item }) {
    return (
      <pre>
        <code>{JSON.stringify(item)}</code>
      </pre>
    );
  },
});
```

#### Props

The function accepts all the [shared props](#shared-props) and the following:

##### `container`

> `string | HTMLElement` | **required**

The container for the `frequentlyBoughtTogether` component. You can either pass a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

##### `itemComponent`

> `({ item }) => JSX.Element` | **required**

The product component to display.

##### `translations`

> `RecommendationTranslations`

<details>

<summary><code>RecommendationTranslations</code></summary>

```ts
type RecommendationTranslations = Partial<{
  title: string;
  showMore: string;
}>;
```

</details>

##### `children`

> `(props: ChildrenProps) => JSX.Element`

<details>

<summary><code>ChildrenProps</code></summary>

```ts
type ChildrenProps<TObject> = {
  recommendations: TObject[];
  View(props: unknown): JSX.Element;
  translations: RecommendationTranslations;
};
```

</details>

Render function to modify the default rendering.

The default implementation is:

```js
function defaultRender(props) {
  if (props.recommendations.length === 0) {
    return null;
  }

  return (
    <section className="auc-Recommendations">
      {props.translations.title && <h3>{props.translations.title}</h3>}

      <props.View />
    </section>
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

### `transformItems`

Function to transform the items retrieved by Algolia. It's useful to edit, add, remove or reorder them.

> `(Array<RecordWithObjectID<TItem>>) => Array<RecordWithObjectID<TItem>>`

<details>

<summary><code>RecordWithObjectID</code></summary>

```ts
type RecordWithObjectID<TItem> = TItem & {
  objectID: string;
};
```

</details>

List of [search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/) to send.
