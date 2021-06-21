# `@algolia/recommend-react`

React package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/).

## Installation

```sh
yarn add @algolia/recommend-react@experimental
# or
npm install @algolia/recommend-react@experimental
```

## `<RelatedProducts />`

Component to display related products.

### Usage

#### Default view

```js
import { RelatedProducts } from '@algolia/recommend-react';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

function RelatedItem({ item }) {
  return (
    <pre>
      <code>{JSON.stringify(item)}</code>
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
      itemComponent={RelatedItem}
    />
  );
}
```

#### Horizontal slider view

Example with the [`HorizontalSlider`](/packages/horizontal-slider-react) UI component:

```js
import { RelatedProducts } from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import algoliasearch from 'algoliasearch';

import '@algolia/ui-components-horizontal-slider-theme';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

function RelatedItem({ item }) {
  return (
    <pre>
      <code>{JSON.stringify(item)}</code>
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
      itemComponent={RelatedItem}
      view={HorizontalSlider}
    />
  );
}
```

### Props

The component accepts all the [shared props](#shared-props) and the following:

#### `itemComponent`

> `({ item }) => JSX.Element` | **required**

The product component to display.

#### `classNames`

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

#### `translations`

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

</details>

#### `view`

<blockquote>
<details>

<summary><code>(props: ViewProps) => JSX.Element</code></summary>

```ts
type ViewProps<TItem extends RecordWithObjectID> = {
  items: TItem[];
  itemComponent({ item: TItem }): JSX.Element;
};
```

</details>
</blockquote>

The view component to render your items into. You can use the [`HorizontalSlider`](/packages/horizontal-slider-react) UI component.

The default implementation is:

```js
function ListView(props) {
  return (
    <div className="auc-Recommend-container">
      <ol className="auc-Recommend-list">
        {props.items.map((item) => (
          <li key={item.objectID} className="auc-Recommend-item">
            <props.itemComponent item={item} />
          </li>
        ))}
      </ol>
    </div>
  );
}
```

#### `fallbackComponent`

> `() => JSX.Element`

The fallback component to render when no recommendations are returned.

#### `children`

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
    <section className="auc-Recommend">
      {props.translations.title && <h3>{props.translations.title}</h3>}

      <props.View />
    </section>
  );
}
```

## `useRelatedProducts`

> [`(props: SharedProps) => { recommendations }`](#shared-props)

Hook to retrieve related products.

### Usage

```jsx
import { useRelatedProducts } from '@algolia/recommend-react';
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
    <div className="auc-Recommend">
      {recommendations.length > 0 && (
        <ol className="auc-Recommend-list">
          {recommendations.map((recommendation) => (
            <li key={recommendation.objectID} className="auc-Recommend-item">
              <pre>
                <code>{JSON.stringify(recommendation)}</code>
              </pre>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
```

### Props

The hook accepts all the [shared props](#shared-props).

## `<FrequentlyBoughtTogether />`

Component to display frequently bought together products.

### Usage

#### Default view

```js
import { FrequentlyBoughtTogether } from '@algolia/recommend-react';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

function RelatedItem({ item }) {
  return (
    <pre>
      <code>{JSON.stringify(item)}</code>
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
      itemComponent={RelatedItem}
    />
  );
}
```

#### Horizontal slider view

Example with the [`HorizontalSlider`](/packages/horizontal-slider-react) UI component:

```js
import { FrequentlyBoughtTogether } from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import algoliasearch from 'algoliasearch';

import '@algolia/ui-components-horizontal-slider-theme';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

function RelatedItem({ item }) {
  return (
    <pre>
      <code>{JSON.stringify(item)}</code>
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
      itemComponent={RelatedItem}
      view={HorizontalSlider}
    />
  );
}
```

### Props

The component accepts all the [shared props](#shared-props) and the following:

#### `itemComponent`

> `({ item }) => JSX.Element` | **required**

The product component to display.

#### `classNames`

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

#### `translations`

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

#### `view`

<blockquote>
<details>

<summary><code>(props: ViewProps) => JSX.Element</code></summary>

```ts
type ViewProps<TItem extends RecordWithObjectID> = {
  items: TItem[];
  itemComponent({ item: TItem }): JSX.Element;
};
```

</details>
</blockquote>

The view component to render your items into. You can use the [`HorizontalSlider`](/packages/horizontal-slider-react) UI component.

The default implementation is:

```js
function ListView(props) {
  return (
    <div className="auc-Recommend-container">
      <ol className="auc-Recommend-list">
        {props.items.map((item) => (
          <li key={item.objectID} className="auc-Recommend-item">
            <props.itemComponent item={item} />
          </li>
        ))}
      </ol>
    </div>
  );
}
```

#### `fallbackComponent`

> `() => JSX.Element`

The fallback component to render when no recommendations are returned.

Example with a [`<RelatedProducts />`](#relatedproducts-) fallback:

```js
function RelatedItem({ item }) {
  return (
    <pre>
      <code>{JSON.stringify(item)}</code>
    </pre>
  );
}

function App({ currentObjectID }) {
  return (
    <FrequentlyBoughtTogether
      searchClient={searchClient}
      indexName={indexName}
      objectIDs={[currentObjectID]}
      itemComponent={RelatedItem}
      fallbackComponent={() => (
        <RelatedProducts
          searchClient={searchClient}
          indexName={indexName}
          objectIDs={[currentObjectID]}
          itemComponent={RelatedItem}
        />
      )}
    />
  );
}
```

#### `children`

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
    <section className="auc-Recommend">
      {props.translations.title && <h3>{props.translations.title}</h3>}

      <props.View />
    </section>
  );
}
```

## `useFrequentlyBoughtTogether`

> [`(props: Omit<SharedProps, 'fallbackParameters'>) => { recommendations }`](#shared-props)

Hook to retrieve frequently bought together products.

### Usage

```jsx
import { useFrequentlyBoughtTogether } from '@algolia/recommend-react';
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
    <div className="auc-Recommend">
      {recommendations.length > 0 && (
        <ol className="auc-Recommend-list">
          {recommendations.map((recommendation) => (
            <li key={recommendation.objectID} className="auc-Recommend-item">
              <pre>
                <code>{JSON.stringify(recommendation)}</code>
              </pre>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
```

### Props

The hook accepts all the [shared props](#shared-props).

## `useRecommendations`

> [`(props: SharedProps & { model: RecommendationModel }) => { recommendations }`](#shared-props)

Generic hook to retrieve hits from an AI model.

### Usage

```jsx
import { useRecommendations } from '@algolia/recommend-react';
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
    <div className="auc-Recommend">
      {recommendations.length > 0 && (
        <ol className="auc-Recommend-list">
          {recommendations.map((recommendation) => (
            <li key={recommendation.objectID} className="auc-Recommend-item">
              <pre>
                <code>{JSON.stringify(recommendation)}</code>
              </pre>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
```

### Props

The hook accepts all the [shared props](#shared-props) and the following:

#### `model`

> `"related-products" | "bought-together"` | **required**

The name of the Recommendation model to use.

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

### `fallbackParameters`

> `Omit<SearchOptions, 'page' | 'hitsPerPage' | 'offset' | 'length'>`

Additional filters to use as fallback when there is not enough recommendations.

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
