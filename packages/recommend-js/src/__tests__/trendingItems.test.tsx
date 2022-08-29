/** @jsx h */
import { ObjectWithObjectID } from '@algolia/client-search';
import { waitFor, within } from '@testing-library/dom';
import { Fragment, h } from 'preact';

import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { trendingItems } from '../trendingItems';

const fallbackComponent = `
<div>
  Fallback component
</div>
`;

const headerAndItemsComponent = `
<div>
  <section
    class="auc-Recommend"
  >
    <h1>
      Trending items
    </h1>
    <div
      class="auc-Recommend-container"
    >
      <ol
        class="auc-Recommend-list"
      >
        <li
          class="auc-Recommend-item"
        >
          1
        </li>
        <li
          class="auc-Recommend-item"
        >
          2
        </li>
        <li
          class="auc-Recommend-item"
        >
          3
        </li>
      </ol>
    </div>
  </section>
</div>
`;

const viewComponent = `
<div>
  <section
    class="auc-Recommend"
  >
    <h3
      class="auc-Recommend-title"
    >
      Trending items
    </h3>
    <li>
      1
    </li>
    <li>
      2
    </li>
    <li>
      3
    </li>
  </section>
</div>
`;

function createMockedRecommendClient(recommendations: ObjectWithObjectID[]) {
  const recommendClient = createRecommendClient({
    getTrendingItems: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: recommendations,
        })
      )
    ),
  });

  return recommendClient;
}

describe('trendingItems', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('rendering the header and items', () => {
    test('renders JSX templates', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      trendingItems<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        headerComponent: () => <h1>Trending items</h1>,
        itemComponent: ({ item }) => <Fragment>{item.objectID}</Fragment>,
      });

      await waitFor(() => {
        expect(within(container).getAllByRole('listitem')).not.toBeNull();
        expect(container).toMatchInlineSnapshot(headerAndItemsComponent);
      });
    });

    test('renders using `createElement` and `Fragment`', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      trendingItems<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        headerComponent: ({ createElement }) =>
          createElement('h1', null, 'Trending items'),
        itemComponent: ({ item, createElement, Fragment }) =>
          createElement(Fragment, null, item.objectID),
      });

      await waitFor(() => {
        expect(within(container).getAllByRole('listitem')).not.toBeNull();
        expect(container).toMatchInlineSnapshot(headerAndItemsComponent);
      });
    });
  });

  describe('rendering `fallbackComponent`', () => {
    test('renders JSX templates', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient([]);

      document.body.appendChild(container);

      trendingItems<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        itemComponent: ({ item }) => <div>{item.objectID}</div>,
        fallbackComponent: () => <div>Fallback component</div>,
      });

      await waitFor(() => {
        expect(
          within(container).getByText('Fallback component')
        ).toMatchInlineSnapshot(fallbackComponent);
      });
    });

    test('renders using `createElement` and `Fragment`', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient([]);

      document.body.appendChild(container);

      trendingItems<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        itemComponent: ({ item, createElement }) =>
          createElement('div', null, item.objectID),
        fallbackComponent: ({ createElement, Fragment }) =>
          createElement(Fragment, null, 'Fallback component'),
      });

      await waitFor(() => {
        expect(
          within(container).getByText('Fallback component')
        ).toMatchInlineSnapshot(fallbackComponent);
      });
    });
  });

  describe('rendering the `view` component', () => {
    test('renders using JSX template', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      trendingItems<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        view: (props) => (
          <Fragment>
            {props.items.map((item) => {
              return (
                <props.itemComponent
                  key={item.objectID}
                  item={item}
                  {...props}
                />
              );
            })}
          </Fragment>
        ),
        itemComponent: ({ item }) => <li>{item.objectID}</li>,
      });

      await waitFor(() => {
        expect(within(container).getAllByRole('listitem')).not.toBeNull();
        expect(container).toMatchInlineSnapshot(viewComponent);
      });
    });

    test('renders using `createElement` and `Fragment`', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      trendingItems<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        view: ({ createElement, Fragment, items, itemComponent }) =>
          createElement(
            Fragment,
            null,
            items.map((item) =>
              itemComponent({ item, createElement, Fragment })
            )
          ),
        itemComponent: ({ item, createElement }) =>
          createElement('li', null, item.objectID),
      });

      await waitFor(() => {
        expect(within(container).getAllByRole('listitem')).not.toBeNull();
        expect(container).toMatchInlineSnapshot(viewComponent);
      });
    });
  });
});
