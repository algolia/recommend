# `@algolia/recommend-js`

JavaScript package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/).

## Installation

```sh
yarn add @algolia/recommend-js@experimental
# or
npm install @algolia/recommend-js@experimental
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

### Default view

```js
/** @jsx h */
import { h } from 'preact';
import { relatedProducts } from '@algolia/recommend-js';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);
const currentObjectID = 'YOUR_OBJECT_ID';

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

### Horizontal slider view

Example with the [`HorizontalSlider`](/packages/horizontal-slider-js) UI component:

```js
/** @jsx h */
import { h } from 'preact';
import { relatedProducts } from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';
import algoliasearch from 'algoliasearch';

import '@algolia/ui-components-horizontal-slider-theme';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);
const currentObjectID = 'YOUR_OBJECT_ID';

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

> `string | HTMLElement`

The container for the `relatedProducts` component. You can either pass a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

##### `itemComponent`

> `({ item }) => JSX.Element` | **required**

The product component to display.

##### `classNames`

<blockquote>
<details>

<summary><code>RelatedProductsClassNames</code></summary>

```ts
type RelatedProductsClassNames = Partial<{
  root: string;
  title: string;
  container: string;
  list: string;
  item: string;
}>;
```

</details>
</blockquote>

The class names for the component.

##### `translations`

<blockquote>
<details>

<summary><code>RelatedProductTranslations</code></summary>

```ts
type RelatedProductTranslations = Partial<{
  title: string;
  showMore: string;
}>;
```

</details>
</blockquote>

The translations for the component.

##### `children`

<blockquote>
<details>

<summary><code>(props: ChildrenProps) => JSX.Element</code></summary>

```ts
type ChildrenProps<TObject> = {
  classNames: RecommendationClassNames;
  recommendations: TObject[];
  translations: Required<RecommendationTranslations>;
  View(props: unknown): JSX.Element;
};
```

</details>
</blockquote>

Render function to modify the complete rendering.

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
import { frequentlyBoughtTogether } from '@algolia/recommend-js';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);
const currentObjectID = 'YOUR_OBJECT_ID';

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

> `string | HTMLElement`

The container for the `frequentlyBoughtTogether` component. You can either pass a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

##### `itemComponent`

> `({ item }) => JSX.Element` | **required**

The product component to display.

##### `classNames`

<blockquote>
<details>

<summary><code>FrequentlyBoughtTogetherClassNames</code></summary>

```ts
type FrequentlyBoughtTogetherClassNames = Partial<{
  root: string;
  title: string;
  container: string;
  list: string;
  item: string;
}>;
```

</details>
</blockquote>

The class names for the component.

##### `translations`

<blockquote>
<details>

<summary><code>FrequentlyBoughtTogetherTranslations</code></summary>

```ts
type FrequentlyBoughtTogetherTranslations = Partial<{
  title: string;
  showMore: string;
}>;
```

</details>
</blockquote>

The translations for the component.

##### `children`

<blockquote>
<details>

<summary><code>(props: ChildrenProps) => JSX.Element</code></summary>

```ts
type ChildrenProps<TObject> = {
  classNames: RecommendationClassNames;
  recommendations: TObject[];
  translations: Required<RecommendationTranslations>;
  View(props: unknown): JSX.Element;
};
```

</details>
</blockquote>

Render function to modify the complete rendering.

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

List of [search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/) to send.

### `transformItems`

<blockquote>
<details>

<summary><code>(Array&lt;RecordWithObjectID&lt;TItem>>) => Array&lt;RecordWithObjectID&lt;TItem>></code></summary>

```ts
type RecordWithObjectID<TItem> = TItem & {
  objectID: string;
};
```

</details>
</blockquote>

Function to transform the items retrieved by Algolia. It's useful to edit, add, remove or reorder them.
