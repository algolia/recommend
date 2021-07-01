# `@algolia/ui-components-horizontal-slider-react`

Horizontal slider UI component for React.

## Installation

```sh
yarn add @algolia/ui-components-horizontal-slider-react
# or
npm install @algolia/ui-components-horizontal-slider-react
```

## Usage

### Standalone

```js
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';

import '@algolia/ui-components-horizontal-slider-theme';

const items = [
  { objectID: '1', name: 'Item 1' },
  { objectID: '2', name: 'Item 2' },
];

function Item({ item }) {
  return (
    <pre>
      <code>{item.name}</code>
    </pre>
  );
}

function App() {
  // ...

  return <HorizontalSlider itemComponent={Item} items={items} />;
}
```

### With Algolia Recommend

See usage for [Recommend](https://github.com/algolia/recommend/tree/next/packages/recommend-react#horizontal-slider-view).

## Props

### `items`

<blockquote>
<details>

<summary><code>RecordWithObjectID</code> | <b>required</b></summary>

```ts
type RecordWithObjectID<TItem> = TItem & {
  objectID: string;
};
```

</details>
</blockquote>

The items to display in the component.

### `itemComponent`

> `({ item }) => JSX.Element` | **required**

The item component to display.

### `translations`

<blockquote>
<details>

<summary><code>HorizontalSliderTranslations</code></summary>

```ts
type HorizontalSliderTranslations = Partial<{
  sliderLabel: string;
  previousButtonLabel: string;
  previousButtonTitle: string;
  nextButtonLabel: string;
  nextButtonTitle: string;
}>;
```

</details>
</blockquote>

The translations for the component.

### `classNames`

<blockquote>
<details>

<summary><code>HorizontalSliderClassnames</code></summary>

```ts
type HorizontalSliderClassnames = Partial<{
  item: string;
  list: string;
  navigation: string;
  navigationNext: string;
  navigationPrevious: string;
  root: string;
}>;
```

</details>
</blockquote>

The class names for the component.
