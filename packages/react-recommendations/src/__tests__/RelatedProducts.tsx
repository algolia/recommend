import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { createRecommendationsClient } from '../../../../test/utils';
import { RelatedProducts } from '../RelatedProducts';

const { searchClient } = createRecommendationsClient();

const ItemComponent = ({ item }) => <div>{item.name}</div>;

describe('RelatedProducts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('render with default props', async () => {
    render(
      <RelatedProducts
        // @ts-expect-error
        searchClient={searchClient}
        indexName={'indexName'}
        objectIDs={['objectID']}
        itemComponent={ItemComponent}
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
        <RelatedProducts
          // @ts-expect-error
          searchClient={searchClient}
          indexName={'indexName'}
          objectIDs={['objectID']}
          itemComponent={ItemComponent}
          view={({ createElement, Fragment }: any) => {
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
        <RelatedProducts
          // @ts-expect-error
          searchClient={searchClient}
          indexName={'indexName'}
          objectIDs={['objectID']}
          itemComponent={({ item, createElement, Fragment }: any) => {
            expect(createElement).toBe(React.createElement);
            expect(Fragment).toBe(React.Fragment);

            return createElement('div', {}, item.name);
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
        <RelatedProducts
          // @ts-expect-error
          searchClient={searchClient}
          indexName={'indexName'}
          objectIDs={['objectID']}
          itemComponent={ItemComponent}
          headerComponent={({ createElement, Fragment }: any) => {
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
        <RelatedProducts
          // @ts-expect-error
          searchClient={searchClient}
          indexName={'indexName'}
          objectIDs={['objectID']}
          itemComponent={ItemComponent}
          fallbackComponent={({ createElement, Fragment }: any) => {
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
