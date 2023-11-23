import algoliasearch from 'algoliasearch';
import React from 'react';
import { Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import insights, { InsightsClient } from 'search-insights';

import { Autocomplete, getAlgoliaResults } from '../components/Autocomplete';
import { PersonalisationRadio } from '../components/PersonalisationRadio';
import { PersonalisationDebug } from '../components/PersonalisationRadio/PersonalisationDebug';
import { apiKey, appId, indexName } from '../config';
import { FacetHit, ProductHit } from '../types';

const searchClient = algoliasearch(appId, apiKey);

insights('init', {
  appId,
  apiKey,
  useCookie: true,
});

export const Root: React.FC = () => {
  const navigate = useNavigate();

  const [userToken, setUserToken] = React.useState('user-token-3');

  const [
    personalisationOption,
    setSelectedPersonalisationOption,
  ] = React.useState('re-rank');

  const [personalisationVersion, setPersonalisationVersion] = React.useState<
    'v1' | 'neural-perso'
  >('neural-perso');

  const [
    selectedProduct,
    setSelectedProduct,
  ] = React.useState<ProductHit | null>(null);

  const [
    selectedFacetValue,
    setSelectedFacetValue,
  ] = React.useState<FacetHit | null>(null);

  React.useEffect(() => {
    insights('setUserToken', userToken);
    insights('setAuthenticatedUserToken', userToken);
  }, [userToken]);

  return (
    <div className="container">
      <PersonalisationRadio
        value={personalisationOption}
        onChange={setSelectedPersonalisationOption}
        userToken={userToken}
        setUserToken={setUserToken}
        personalisationVersion={personalisationVersion}
        setPersonalisationVersion={setPersonalisationVersion}
      />

      <h1 className="title">
        <Link to="/">Algolia Recommend</Link>
      </h1>
      <Autocomplete
        placeholder="Search for a product"
        openOnFocus={true}
        defaultActiveItemId={0}
        getSources={({ query }) => {
          return [
            {
              sourceId: 'suggestions',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName,
                      query,
                      params: {
                        hitsPerPage: 5,
                      },
                    },
                  ],
                });
              },
              getItemInputValue({ item }) {
                return item.name;
              },
              onSelect({ item }) {
                setSelectedProduct(item);
                navigate(`/product/${item.objectID}`);
              },
              templates: {
                item({ item, components }) {
                  return (
                    <div className="aa-ItemWrapper">
                      <div className="aa-ItemContent">
                        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
                          <img
                            src={item.image_urls[0]}
                            alt={item.name}
                            width="40"
                            height="40"
                          />
                        </div>

                        <div className="aa-ItemContentBody">
                          <div className="aa-ItemContentTitle">
                            <components.Highlight hit={item} attribute="name" />
                          </div>
                          <div className="aa-ItemContentDescription">
                            In <strong>{item.brand}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                },
              },
            },
          ];
        }}
      />
      <Outlet
        context={[
          {
            insights,
            selectedProduct,
            setSelectedProduct,
            selectedFacetValue,
            setSelectedFacetValue,
            personalisationOption,
            personalisationVersion,
            userToken,
          },
        ]}
      />

      {personalisationOption !== 'disabled' && (
        <PersonalisationDebug userToken={userToken} />
      )}
    </div>
  );
};

type ApplicationContextType = Array<{
  insights: InsightsClient;
  selectedProduct: ProductHit | null;
  setSelectedProduct: (hit: ProductHit | null) => void;
  selectedFacetValue: FacetHit | null;
  setSelectedFacetValue: (facet: FacetHit | null) => void;
  personalisationOption: 'disabled' | 're-rank' | 'filters';
  personalisationVersion: 'v1' | 'neural-perso';
  userToken: string;
}>;

export function useApplicationContext() {
  return useOutletContext<ApplicationContextType>();
}
