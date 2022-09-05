/** @jsx h */
import { ObjectWithObjectID } from '@algolia/client-search';
import { waitFor, within } from '@testing-library/dom';
import { Fragment, h } from 'preact';

import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { relatedProducts } from '../relatedProducts';

function createMockedRecommendClient(recommendations: ObjectWithObjectID[]) {
  const recommendClient = createRecommendClient({
    getRelatedProducts: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: recommendations,
        })
      )
    ),
  });

  return recommendClient;
}

describe('relatedProducts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('renders using header and items', () => {
    test('renders JSX templates', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        headerComponent: () => <h1>RP</h1>,
        itemComponent: ({ item }) => <Fragment>{item.objectID}</Fragment>,
      });

      await waitFor(() => {
        expect(within(container).getAllByRole('listitem')).not.toBeNull();
        expect(container).toMatchInlineSnapshot(`
<div>
  <section
    class="auc-Recommend"
  >
    <h1>
      RP
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
`);
      });
    });

    test('renders using `createElement` and `Fragment`', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        headerComponent: ({ createElement }) => createElement('h1', null, 'RP'),
        itemComponent: ({ item, createElement, Fragment }) =>
          createElement(Fragment, null, item.objectID),
      });

      await waitFor(() => {
        expect(within(container).getAllByRole('listitem')).not.toBeNull();
        expect(container).toMatchInlineSnapshot(`
<div>
  <section
    class="auc-Recommend"
  >
    <h1>
      RP
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
`);
      });
    });

    test('using html templating', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        headerComponent: ({ html }) => {
          return html`<h1>RP</h1>`;
        },
        itemComponent: ({ item, Fragment, html }) => {
          return html`<${Fragment}>${item.objectID}</${Fragment}>`;
        },
      });

      await waitFor(() => {
        expect(within(container).getAllByRole('listitem')).not.toBeNull();
        expect(container).toMatchInlineSnapshot(`
<div>
  <section
    class="auc-Recommend"
  >
    <h1>
      RP
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
`);
      });
    });
  });

  describe('rendering `fallbackComponent`', () => {
    test('renders JSX templates', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient([]);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        itemComponent: ({ item }) => <div>{item.objectID}</div>,
        fallbackComponent: () => <div>Fallback component</div>,
      });

      await waitFor(() => {
        expect(within(container).getByText('Fallback component'))
          .toMatchInlineSnapshot(`
          <div>
            Fallback component
          </div>
          `);
      });
    });

    test('renders using `createElement` and `Fragment`', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient([]);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        itemComponent: ({ item, createElement }) =>
          createElement('div', null, item.objectID),
        fallbackComponent: ({ createElement, Fragment }) =>
          createElement(Fragment, null, 'Fallback component'),
      });

      await waitFor(() => {
        expect(within(container).getByText('Fallback component'))
          .toMatchInlineSnapshot(`
          <div>
            Fallback component
          </div>
          `);
      });
    });

    test('renders using html templating', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient([]);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        itemComponent: ({ item, html }) => html`<div>${item.objectID}</div>`,
        fallbackComponent: ({ html }) => html`<div>Fallback component</div>`,
      });

      await waitFor(() => {
        expect(within(container).getByText('Fallback component'))
          .toMatchInlineSnapshot(`
          <div>
            Fallback component
          </div>
          `);
      });
    });
  });

  describe('rendering the `view` component', () => {
    test('renders using JSX template', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
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
        expect(container).toMatchInlineSnapshot(`
          <div>
            <section
              class="auc-Recommend"
            >
              <h3
                class="auc-Recommend-title"
              >
                Related products
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
        `);
      });
    });

    test('renders using `createElement` and `Fragment`', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
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
        expect(container).toMatchInlineSnapshot(`
            <div>
              <section
                class="auc-Recommend"
              >
                <h3
                  class="auc-Recommend-title"
                >
                  Related products
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
        `);
      });
    });

    test('renders using html templating', async () => {
      const container = document.createElement('div');

      const recommendClient = createMockedRecommendClient(hit.recommendations);

      document.body.appendChild(container);

      relatedProducts<ObjectWithObjectID>({
        container,
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        view: ({ html, items, itemComponent, createElement, Fragment }) =>
          html`<${Fragment}>
            ${items.map((item) =>
              itemComponent({ item, createElement, Fragment })
            )}
          </${Fragment}>`,
        itemComponent: ({ item, html }) => html`<li>${item.objectID}</li>`,
      });

      await waitFor(() => {
        expect(within(container).getAllByRole('listitem')).not.toBeNull();
        expect(container).toMatchInlineSnapshot(`
            <div>
              <section
                class="auc-Recommend"
              >
                <h3
                  class="auc-Recommend-title"
                >
                  Related products
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
        `);
      });
    });
  });
});
