import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { createRecommendClient } from '../../../../test/utils/createRecommendClient';
import { TrendingFacets } from '../TrendingFacets';

import { ErrorBoundary } from './helpers/ErrorBoundary';
import '@testing-library/jest-dom';

describe('TrendingFacets', () => {
  test('assures it handles errors', async () => {
    const recommendClient = createRecommendClient({
      getTrendingFacets: jest.fn(
        () =>
          Promise.reject(new Error('Invalid Application-Id or API-Key')) as any
      ),
    });
    jest.spyOn(console, 'error').mockImplementation();

    render(
      <ErrorBoundary>
        <TrendingFacets<any>
          recommendClient={recommendClient}
          facetName="facetName"
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
