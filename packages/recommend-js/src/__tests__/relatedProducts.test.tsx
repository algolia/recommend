/** @jsx h */
import { ObjectWithObjectID } from '@algolia/client-search';
import { waitFor, within } from '@testing-library/dom';
import { h } from 'preact';

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

  return {
    recommendClient,
  };
}

describe('related products', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Rendering for header and item', () => {
    test('renders JSX templates', async () => {
      const panelContainer = document.createElement('div');
      panelContainer.setAttribute('id', 'relatedProducts');

      const { recommendClient } = createMockedRecommendClient(
        hit.recommendations
      );

      document.body.appendChild(panelContainer);

      relatedProducts<ObjectWithObjectID>({
        container: '#relatedProducts',
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        headerComponent: () => <h1>RP</h1>,
        itemComponent: ({ item }) => <div>{item.objectID}</div>,
      });

      await waitFor(() => {
        expect(within(panelContainer).getAllByRole('listitem')).not.toBeNull();
        expect(panelContainer).toMatchInlineSnapshot(`
          <div
            id="relatedProducts"
          >
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
                    <div>
                      1
                    </div>
                  </li>
                  <li
                    class="auc-Recommend-item"
                  >
                    <div>
                      2
                    </div>
                  </li>
                  <li
                    class="auc-Recommend-item"
                  >
                    <div>
                      3
                    </div>
                  </li>
                </ol>
              </div>
            </section>
          </div>
        `);
      });
    });

    test('renders templates using createElement and Fragment', async () => {
      const panelContainer = document.createElement('div');
      panelContainer.setAttribute('id', 'relatedProducts');

      const { recommendClient } = createMockedRecommendClient(
        hit.recommendations
      );

      document.body.appendChild(panelContainer);

      relatedProducts<ObjectWithObjectID>({
        container: '#relatedProducts',
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        headerComponent: ({ createElement }) => createElement('h1', null, 'RP'),
        itemComponent: ({ item, createElement, Fragment }) =>
          createElement(Fragment, null, item.objectID),
      });

      await waitFor(() => {
        expect(within(panelContainer).getAllByRole('listitem')).not.toBeNull();
        expect(panelContainer).toMatchInlineSnapshot(`
          <div
            id="relatedProducts"
          >
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

  describe('Rendering fallbackComponent', () => {
    test('renders JSX templates', async () => {
      const panelContainer = document.createElement('div');
      panelContainer.setAttribute('id', 'relatedProducts');

      const { recommendClient } = createMockedRecommendClient([]);

      document.body.appendChild(panelContainer);

      relatedProducts<ObjectWithObjectID>({
        container: '#relatedProducts',
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        itemComponent: ({ item }) => <div>{item.objectID}</div>,
        fallbackComponent: () => <div>Fallback component</div>,
      });

      await waitFor(() => {
        expect(within(panelContainer).getByText('Fallback component'))
          .toMatchInlineSnapshot(`
          <div>
            Fallback component
          </div>
        `);
      });
    });

    test('renders templates using createElement and Fragment', async () => {
      const panelContainer = document.createElement('div');
      panelContainer.setAttribute('id', 'relatedProducts');

      const { recommendClient } = createMockedRecommendClient([]);

      document.body.appendChild(panelContainer);

      relatedProducts<ObjectWithObjectID>({
        container: '#relatedProducts',
        recommendClient,
        indexName: 'products',
        objectIDs: ['D06270-9132-995'],
        itemComponent: ({ item, createElement }) =>
          createElement('div', null, item.objectID),
        fallbackComponent: ({ createElement, Fragment }) =>
          createElement(Fragment, null, 'Fallback component'),
      });

      await waitFor(() => {
        expect(within(panelContainer).getByText('Fallback component'))
          .toMatchInlineSnapshot(`
          <div
            id="relatedProducts"
          >
            Fallback component
          </div>
          `);
      });
    });
  });
});
