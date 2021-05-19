# `@algolia/ui-components-js-horizontal-slider`

Horizontal slider UI component for JavaScript.

## Installation

```sh
yarn add @algolia/ui-components-js-horizontal-slider@experimental
# or
npm install @algolia/ui-components-js-horizontal-slider@experimental
```

## Usage

To get started, you need a container for your slider to go in. If you don’t have one already, you can insert one into your markup:

```html
<div id="horizontal-slider"></div>
```

Then, insert your slider into it by calling the `horizontalSlider` function and providing the [`container`](#container). It can be a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

```js
import { horizontalSlider } from '@algolia/ui-components-js-horizontal-slider';

import '@algolia/ui-components-js-horizontal-slider/HorizontalSlider.css';

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

## Params

### `container`

> `string | HTMLElement` | **required**

The container for the horizontal slider. You can either pass a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

### `items`

> `RecordWithObjectID<TItem>` | **required**

The items to display in the component.

<details>

<summary><code>RecordWithObjectID</code></summary>

```ts
type RecordWithObjectID<TItem> = TItem & {
  objectID: string;
};
```

</details>

### `itemComponent`

> `({ item }) => JSX.Element` | **required**

The item component to display.

### `translations`

> `HorizontalSliderTranslations`

The translations for the component.

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

### `classNames`

> `HorizontalSliderClassnames`

The class names for the component.

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

### `environment`

> `typeof window` | defaults to `window`

The environment in which your application is running.

This is useful if you’re using the slider in a different context than window.
