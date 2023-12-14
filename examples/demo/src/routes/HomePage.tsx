import algoliarecommend from '@algolia/recommend';
import {
  Recommend,
  TrendingFacets,
  TrendingItems,
  RecommendedForYou,
} from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Hit, Facet } from '../components';
import { apiKey, appId, indexName } from '../config';
import { ProductHit } from '../types';

import { useApplicationContext } from './Root';

const recommendClient = algoliarecommend(appId, apiKey);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [
    { insights, setSelectedProduct, selectedFacetValue, setSelectedFacetValue },
  ] = useApplicationContext();

  return (
    <Recommend recommendClient={recommendClient}>
      <TrendingFacets<string>
        indexName={indexName}
        facetName="brand"
        itemComponent={({ item }) => (
          <Facet
            hit={item}
            insights={insights}
            onSelect={(facetHits) => {
              const isSameValue =
                selectedFacetValue &&
                facetHits.facetValue === selectedFacetValue.facetValue;
              setSelectedFacetValue(isSameValue ? null : facetHits);
            }}
            indexName={indexName}
          />
        )}
        maxRecommendations={5}
        translations={{
          title: 'Trending Facet (brand)',
        }}
      />
      <TrendingItems<ProductHit>
        indexName={indexName}
        facetName={selectedFacetValue ? 'brand' : undefined}
        facetValue={
          selectedFacetValue ? selectedFacetValue.facetValue : undefined
        }
        itemComponent={({ item }) => (
          <Hit
            hit={item}
            insights={insights}
            onSelect={(item) => {
              setSelectedProduct(item);
              navigate(`/product/${item.objectID}`);
            }}
          />
        )}
        maxRecommendations={10}
        view={HorizontalSlider}
        translations={{
          title: `Trending products ${
            selectedFacetValue ? `in ${selectedFacetValue.facetValue}` : ''
          }`,
        }}
      />
      <RecommendedForYou<ProductHit>
        indexName={indexName}
        maxRecommendations={15}
        queryParameters={{
          userToken: 'user-token-1',
        }}
        itemComponent={({ item }) => (
          <Hit
            hit={item}
            insights={insights}
            onSelect={(item) => {
              setSelectedProduct(item);
              navigate(`/product/${item.objectID}`);
            }}
          />
        )}
        fallbackComponent={() => <div>No recommendations</div>}
      />
    </Recommend>
  );
};
