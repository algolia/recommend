# `@algolia/ui-components-horizontal-slider-js`

Horizontal slider UI component for JavaScript.

## Installation

```sh
yarn add @algolia/ui-components-horizontal-slider-js
# or
npm install @algolia/ui-components-horizontal-slider-js
```

## Usage

To get started, you need a container for your slider to go in. If you don’t have one already, you can insert one into your markup:

```html
<div id="horizontal-slider"></div>
```

Then, you can call the `horizontalSlider` function and provide the container. It can be a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

### Standalone

```js
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';

import '@algolia/ui-components-horizontal-slider-theme';

const items = [
  { objectID: '1', name: 'Item 1' },
  { objectID: '2', name: 'Item 2' },
];

horizontalSlider({
  container: '#horizontal-slider',
  items,
  itemComponent({ item }) {
    return item.name;
  },
});
```

### With Algolia Recommend

See usage for [Recommend](https://github.com/algolia/recommend/tree/next/packages/recommend-js#horizontal-slider-view).

## Props

### `container`

> `string | HTMLElement`

The container for the component. You can either pass a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement). If there are several containers matching the selector, it picks up the first one.

When `undefined`, the function returns a JSX element for you to inject wherever you want.

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

</details>

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

### `environment`

> `typeof window` | defaults to `window`

The environment in which your application is running.

This is useful if you’re using the slider in a different context than window.
