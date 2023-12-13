import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { createRecommendClient } from '../../../../test/utils/createRecommendClient';
import { TrendingItems } from '../TrendingItems';

import { ErrorBoundary } from './helpers/ErrorBoundary';
import '@testing-library/jest-dom';

describe('TrendingFacets', () => {
  test('assures it handles errors', async () => {
    const recommendClient = createRecommendClient({
      getTrendingItems: jest.fn(
        () =>
          Promise.reject(new Error('Invalid Application-Id or API-Key')) as any
      ),
    });
    jest.spyOn(console, 'error').mockImplementation();

    render(
      <ErrorBoundary>
        <TrendingItems<any>
          recommendClient={recommendClient}
          indexName="indexName"
          itemComponent={({ item }) => <div>{item}</div>}
        />
      </ErrorBoundary>
    );

    await waitFor(() =>
      expect(
        screen.getByText('Invalid Application-Id or API-Key')
      ).toBeInTheDocument()
    );
  });
});
