import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { createRecommendationsClient } from '../../../../test/utils';
import { FrequentlyBoughtTogether } from '../FrequentlyBoughtTogether';

const { searchClient } = createRecommendationsClient();

const Item = ({ item }) => <div>{item.name}</div>;

describe('FrequentlyBoughtTogether', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('render with default props', async () => {
    render(
      <FrequentlyBoughtTogether
        // @ts-expect-error
        searchClient={searchClient}
        indexName="indexName"
        objectIDs={['objectID']}
        itemComponent={Item}
      />
    );

    await waitFor(() => {
      expect(
        document.querySelector('.auc-Recommendations')
      ).toBeInTheDocument();
    });
  });

  describe('view', () => {
    test('pass `createElement` and `Fragment` to the component', async () => {
      render(
        <FrequentlyBoughtTogether
          // @ts-expect-error
          searchClient={searchClient}
          indexName="indexName"
          objectIDs={['objectID']}
          itemComponent={Item}
          view={({ createElement, Fragment }) => {
            expect(createElement).toBe(React.createElement);
            expect(Fragment).toBe(React.Fragment);

            return createElement('div', {}, 'view');
          }}
        />
      );

      await waitFor(() => {
        expect(
          document.querySelector('.auc-Recommendations')
        ).toBeInTheDocument();
      });
    });
  });

  describe('itemComponent', () => {
    test('pass `createElement` and `Fragment` to the component', async () => {
      render(
        <FrequentlyBoughtTogether
          // @ts-expect-error
          searchClient={searchClient}
          indexName="indexName"
          objectIDs={['objectID']}
          itemComponent={({ createElement, Fragment }) => {
            expect(createElement).toBe(React.createElement);
            expect(Fragment).toBe(React.Fragment);

            return createElement('div', {}, 'itemComponent');
          }}
        />
      );

      await waitFor(() => {
        expect(
          document.querySelector('.auc-Recommendations')
        ).toBeInTheDocument();
      });
    });
  });

  describe('headerComponent', () => {
    test('pass `createElement` and `Fragment` to the component', async () => {
      render(
        <FrequentlyBoughtTogether
          // @ts-expect-error
          searchClient={searchClient}
          indexName="indexName"
          objectIDs={['objectID']}
          itemComponent={Item}
          headerComponent={({ createElement, Fragment }) => {
            expect(createElement).toBe(React.createElement);
            expect(Fragment).toBe(React.Fragment);

            return createElement('div', {}, 'header');
          }}
        />
      );

      await waitFor(() => {
        expect(
          document.querySelector('.auc-Recommendations')
        ).toBeInTheDocument();
      });
    });
  });

  describe('fallbackComponent', () => {
    test('pass `createElement` and `Fragment` to the component', async () => {
      render(
        <FrequentlyBoughtTogether
          // @ts-expect-error
          searchClient={searchClient}
          indexName="indexName"
          objectIDs={['objectID']}
          itemComponent={Item}
          fallbackComponent={({ createElement, Fragment }) => {
            expect(createElement).toBe(React.createElement);
            expect(Fragment).toBe(React.Fragment);

            return createElement('div', {}, 'fallbackComponent');
          }}
        />
      );

      await waitFor(() => {
        expect(
          document.querySelector('.auc-Recommendations')
        ).toBeInTheDocument();
      });
    });
  });
});
