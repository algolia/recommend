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

<blockquote>
<details>

<summary><code>(props: ItemComponentProps) => JSX.Element</code> | <b>required</b></summary>

```ts
type ItemComponentProps<TObject> = {
  item: TObject;
  /**
   * The function to create virtual nodes.
   *
   * @default React.createElement
   */
  createElement: (
    type: any,
    props: Record<string, any> | null,
    ...children: JSX.Element[]
  ) => JSX.Element;
  /**
   * The component to use to create fragments.
   *
   * @default React.Fragment
   */
  Fragment: any;
};
```

</details>
</blockquote>

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
