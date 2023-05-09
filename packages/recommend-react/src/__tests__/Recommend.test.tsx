import { RecommendModel } from '@algolia/recommend';
import { render, waitFor } from '@testing-library/react';
import React, { StrictMode } from 'react';
import '@testing-library/jest-dom';

import { createMultiSearchResponse } from '../../../../test/utils';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { RelatedProducts, FrequentlyBoughtTogether } from '../index';
import { Recommend, useRecommendContext } from '../Recommend';

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
  it('should use the recommendClient from the provider by default', async () => {
    const { recommendClient } = createMockedRecommendClient();

    render(
      <StrictMode>
        <Recommend recommendClient={recommendClient}>
          <RelatedProducts
            indexName="index"
            objectIDs={['1234']}
            maxRecommendations={10}
            itemComponent={(item) => <>{`${item}`}</>}
          />
          <FrequentlyBoughtTogether
            indexName="index"
            objectIDs={['5678']}
            maxRecommendations={10}
            itemComponent={(item) => <>{`${item}`}</>}
          />
        </Recommend>
      </StrictMode>
    );

    await waitFor(() => {
      expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
      expect(recommendClient.getRecommendations).toHaveBeenLastCalledWith([
        {
          indexName: 'index',
          maxRecommendations: 10,
          model: 'related-products',
          objectID: '1234',
          fallbackParameters: undefined,
          queryParameters: undefined,
          threshold: undefined,
        },
        {
          indexName: 'index',
          maxRecommendations: 10,
          model: 'related-products',
          objectID: '5678',
          fallbackParameters: undefined,
          queryParameters: undefined,
          threshold: undefined,
        },
      ]);
    });
  });

  it('should use the recommendClient from the component if provided', async () => {
    const { recommendClient } = createMockedRecommendClient();
    const {
      recommendClient: recommendClientFbt,
    } = createMockedRecommendClient();

    render(
      <StrictMode>
        <Recommend recommendClient={recommendClient}>
          <RelatedProducts
            indexName="index"
            objectIDs={['1234']}
            maxRecommendations={10}
            itemComponent={(item) => <>{`${item}`}</>}
          />
          <FrequentlyBoughtTogether
            indexName="index"
            objectIDs={['5678']}
            maxRecommendations={10}
            recommendClient={recommendClientFbt}
            itemComponent={(item) => <>{`${item}`}</>}
          />
        </Recommend>
      </StrictMode>
    );

    await waitFor(() => {
      expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
      expect(recommendClient.getRecommendations).toHaveBeenLastCalledWith([
        {
          indexName: 'index',
          maxRecommendations: 10,
          model: 'related-products',
          objectID: '1234',
        },
      ]);
      expect(
        recommendClientFbt.getFrequentlyBoughtTogether
      ).toHaveBeenCalledTimes(1);
      expect(
        recommendClientFbt.getFrequentlyBoughtTogether
      ).toHaveBeenLastCalledWith([
        {
          indexName: 'index',
          maxRecommendations: 10,
          objectID: '5678',
          queryParameters: undefined,
          threshold: undefined,
        },
      ]);
    });
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

  it('should cache results', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { rerender } = render(
      <Recommend recommendClient={recommendClient}>
        <RecommendComponent model="related-products" objectId="1234" />
        <RecommendComponent model="bought-together" objectId="5678" />
      </Recommend>,
      {
        wrapper: StrictMode,
      }
    );

    await waitFor(() =>
      expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1)
    );

    rerender(
      <Recommend recommendClient={recommendClient}>
        <RecommendComponent model="related-products" objectId="1234" />
        <RecommendComponent model="bought-together" objectId="5678" />
      </Recommend>
    );

    await waitFor(() =>
      expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1)
    );
  });

  it('should only query the required data', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { rerender } = render(
      <Recommend recommendClient={recommendClient}>
        <RecommendComponent model="related-products" objectId="1234" />
        <RecommendComponent model="bought-together" objectId="5678" />
      </Recommend>,
      {
        wrapper: StrictMode,
      }
    );

    await waitFor(() =>
      expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1)
    );

    rerender(
      <Recommend recommendClient={recommendClient}>
        <RecommendComponent model="related-products" objectId="1234" />
        <RecommendComponent model="bought-together" objectId="5555" />
      </Recommend>
    );

    await waitFor(() => {
      expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(2);

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
      ]);

      expect(recommendClient.getRecommendations).toHaveBeenNthCalledWith(2, [
        {
          indexName: 'index',
          maxRecommendations: 10,
          model: 'bought-together',
          objectID: '5555',
        },
      ]);
    });
  });
});
