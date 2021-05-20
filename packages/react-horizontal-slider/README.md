# `@algolia/ui-components-react-horizontal-slider`

Horizontal slider UI component for React.

## Installation

```sh
yarn add @algolia/ui-components-react-horizontal-slider@experimental
# or
npm install @algolia/ui-components-react-horizontal-slider@experimental
```

## Usage

### Standalone

```js
import { HorizontalSlider } from '@algolia/ui-components-react-horizontal-slider';

import '@algolia/ui-components-react-horizontal-slider/HorizontalSlider.css';

function Item({ item }) {
  return (
    <pre>
      <code>{JSON.stringify(item)}</code>
    </pre>
  );
}

function App() {
  // ...

  return <HorizontalSlider itemComponent={Item} items={items} />;
}
```

### With recommendations

See usage for [Recommendations](/packages/react-recommendations#horizontal-slider-view).

## Props

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
