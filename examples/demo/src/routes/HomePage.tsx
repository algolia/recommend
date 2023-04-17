import algoliarecommend from '@algolia/recommend';
import { TrendingFacets, TrendingItems } from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Hit, Facet } from '../components';
import { apiKey, appId, indexName } from '../config';
import { FacetHit, ProductHit } from '../types';

import { useApplicationContext } from './Root';

const recommendClient = algoliarecommend(appId, apiKey);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [
    { insights, setSelectedProduct, selectedFacetValue, setSelectedFacetValue },
  ] = useApplicationContext();

  return (
    <div>
      <TrendingFacets<FacetHit>
        recommendClient={recommendClient}
        indexName={indexName}
        facetName="brand"
        itemComponent={({ item }) => (
          <Facet
            hit={item}
            insights={insights}
            onSelect={(facetHits) => {
              setSelectedFacetValue(
                facetHits.facetValue === selectedFacetValue?.facetValue
                  ? null
                  : facetHits
              );
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
        recommendClient={recommendClient}
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
    </div>
  );
};
