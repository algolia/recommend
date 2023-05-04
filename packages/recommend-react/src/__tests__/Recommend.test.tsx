import { RecommendModel } from '@algolia/recommend';
import { render, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { StrictMode } from 'react';
import '@testing-library/jest-dom';

import { createMultiSearchResponse } from '../../../../test/utils';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import {
  Recommend,
  useRecommendContext,
  useRecommendClient,
} from '../Recommend';

function createMockedRecommendClient() {
  const recommendClient = createRecommendClient({
    getRecommendations: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit],
        })
      )
    ),
  });

  return {
    recommendClient,
  };
}

const RecommendComponent = ({
  objectId,
  model,
}: {
  objectId: string;
  model: RecommendModel;
}) => {
  const { register } = useRecommendContext();
  React.useEffect(() => {
    const key = JSON.stringify({ objectId });
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
              model,
              indexName: 'index',
              objectID: objectId,
              maxRecommendations: 10,
            },
          ],
        };
      },
      onRequest: () => {},
      onResult: () => {},
    });
  }, [register, objectId, model]);
  return null;
};

describe('Recommend', () => {
  it('should throw an Error when no recommend client is provided', () => {
    jest.spyOn(console, 'error').mockImplementation();
    renderHook(() => useRecommendClient(null));
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled();
  });

  it('prefer the recommendClient from the context', () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(() => useRecommendClient(null), {
      wrapper: ({ children }) => (
        <StrictMode>
          <Recommend recommendClient={recommendClient}>{children}</Recommend>
        </StrictMode>
      ),
    });
    expect(result.current.client).toEqual(recommendClient);
    expect(result.current.isContextClient).toEqual(true);
  });

  it('prefer the recommendClient from parameters', () => {
    const {
      recommendClient: recommendClientContext,
    } = createMockedRecommendClient();
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(() => useRecommendClient(recommendClient), {
      wrapper: ({ children }) => (
        <StrictMode>
          <Recommend recommendClient={recommendClientContext}>
            {children}
          </Recommend>
        </StrictMode>
      ),
    });
    expect(result.current.client).toEqual(recommendClient);
    expect(result.current.isContextClient).toEqual(false);
  });

  it('should use the recommendClient', async () => {
    const { recommendClient } = createMockedRecommendClient();

    render(
      <Recommend recommendClient={recommendClient}>
        <RecommendComponent model="related-products" objectId="1234" />
        <RecommendComponent model="bought-together" objectId="5678" />
      </Recommend>,
      {
        wrapper: StrictMode,
      }
    );

    await waitFor(() =>
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
          model: 'bought-together',
          objectID: '5678',
        },
      ])
    );
  });
});
