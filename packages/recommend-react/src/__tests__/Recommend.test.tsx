import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import { createMultiSearchResponse } from '../../../../test/utils';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { Recommend, useRecommendContext } from '../Recommend';

function createMockedRecommendClient() {
  const recommendClient = createRecommendClient({
    getRecommendations: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit, hit],
        })
      )
    ),
  });

  return {
    recommendClient,
  };
}

describe('Recommend', () => {
  const onResultSpy = jest.fn();

  const RecommendComponent = ({
    objectId,
    model,
  }: {
    objectId: string;
    model: string;
  }) => {
    const { register, hasProvider } = useRecommendContext();

    React.useEffect(() => {
      const key = JSON.stringify({
        k: objectId,
      });
      register({
        key,
        getParameters: () => {
          return {
            keyPair: {
              key,
              value: 1,
            },
            queries: [
              {
                indexName: 'index',
                model,
                objectID: objectId,
                maxRecommendations: 10,
              },
            ],
          };
        },
        onRequest: () => {},
        onResult: (result) => {
          onResultSpy(result);
        },
      });
    }, [register, objectId, model]);
    return (
      <div>
        <div>hasProvider:{`${hasProvider}`}</div>
      </div>
    );
  };

  it('should call getRecommendations with a batch request', async () => {
    const { recommendClient } = createMockedRecommendClient();

    act(() => {
      render(
        <Recommend recommendClient={recommendClient}>
          <RecommendComponent model="related-products" objectId="1234" />
          <RecommendComponent
            model="frequently-bought-together"
            objectId="5678"
          />
        </Recommend>
      );
    });

    await waitFor(() =>
      expect(onResultSpy).toHaveBeenNthCalledWith(1, {
        recommendations: [hit],
      })
    );
    expect(recommendClient.getRecommendations).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'index',
        maxRecommendations: 10,
        model: 'related-products',
        objectID: '1234',
      },
      {
        indexName: 'index',
        maxRecommendations: 10,
        model: 'frequently-bought-together',
        objectID: '5678',
      },
    ]);
  });
});
