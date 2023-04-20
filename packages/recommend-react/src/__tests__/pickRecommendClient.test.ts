import {
  createMultiSearchResponse,
  createRecommendClient,
} from '../../../../test/utils';
import { pickRecommendClient } from '../utils/pickRecommendClient';

describe('pickRecommendClient', () => {
  const recommendClientFromContext = createRecommendClient({
    getFrequentlyBoughtTogether: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [],
        })
      )
    ),
  });

  const recommendClientFromComponent = createRecommendClient({
    getFrequentlyBoughtTogether: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [],
        })
      )
    ),
  });

  it('should throw if no client is present', () => {
    expect(() => pickRecommendClient(null, null)).toThrow(
      'Pass an Algolia `recommendClient` instance either to the RecommendContext, a library component or hook.'
    );
  });

  it('should pick the component client when both are passed', () => {
    expect(
      pickRecommendClient(
        recommendClientFromContext,
        recommendClientFromComponent
      )
    ).toEqual({
      client: recommendClientFromComponent,
      isContextClient: false,
    });
  });

  it('should pick the component client when it is the only one passed', () => {
    expect(
      pickRecommendClient(undefined, recommendClientFromComponent)
    ).toEqual({
      client: recommendClientFromComponent,
      isContextClient: false,
    });

    expect(pickRecommendClient(null, recommendClientFromComponent)).toEqual({
      client: recommendClientFromComponent,
      isContextClient: false,
    });
  });

  it('should pick the context client when it is the only one passed', () => {
    expect(pickRecommendClient(recommendClientFromContext, undefined)).toEqual({
      client: recommendClientFromContext,
      isContextClient: true,
    });

    expect(pickRecommendClient(recommendClientFromContext, null)).toEqual({
      client: recommendClientFromContext,
      isContextClient: true,
    });
  });
});
