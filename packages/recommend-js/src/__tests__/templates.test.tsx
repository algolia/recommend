/** @jsx h */
import { waitFor, within } from '@testing-library/dom';
import { h } from 'preact';

import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import { createRecommendClient } from '../../../../test/utils/createRecommendClient';
import { frequentlyBoughtTogether } from '../frequentlyBoughtTogether';

function createMockedRecommendClient() {
  const recommendClient = createRecommendClient({
    getFrequentlyBoughtTogether: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [
            { objectID: '1', score: 1.99 },
            { objectID: '2', score: 2.99 },
            { objectID: '3', score: 3.99 },
          ],
        })
      )
    ),
  });

  return {
    recommendClient,
  };
}

describe('templates', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('renders JSX templates', async () => {
    const panelContainer = document.createElement('div');
    panelContainer.setAttribute('id', 'frequentlyBoughtTogether');

    const { recommendClient } = createMockedRecommendClient();

    document.body.appendChild(panelContainer);

    frequentlyBoughtTogether<any>({
      container: '#frequentlyBoughtTogether',
      recommendClient,
      indexName: 'products',
      objectIDs: ['D06270-9132-995'],
      headerComponent: () => <h1>FBT</h1>,
      itemComponent: ({ item }) => <div>{item.objectID}</div>,
    });

    await waitFor(() => {
      expect(
        within(panelContainer).getByText('1').parentNode.parentElement
          .parentElement.parentElement
      ).toMatchInlineSnapshot(`
      <section
        class="auc-Recommend"
      >
        <h1>
          FBT
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
      `);
    });
  });

  test('renders templates using `createElement`', async () => {
    const panelContainer = document.createElement('div');
    panelContainer.setAttribute('id', 'frequentlyBoughtTogether');

    const { recommendClient } = createMockedRecommendClient();

    document.body.appendChild(panelContainer);

    frequentlyBoughtTogether<any>({
      container: '#frequentlyBoughtTogether',
      recommendClient,
      indexName: 'products',
      objectIDs: ['D06270-9132-995'],
      headerComponent: ({ createElement }) => createElement('h1', null, 'FBT'),
      itemComponent: ({ item, createElement }) =>
        createElement('div', null, item.objectID),
    });

    await waitFor(() => {
      expect(
        within(panelContainer).getByText('1').parentNode.parentElement
          .parentElement.parentElement
      ).toMatchInlineSnapshot(`
      <section
        class="auc-Recommend"
      >
        <h1>
          FBT
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
      `);
    });
  });
});
