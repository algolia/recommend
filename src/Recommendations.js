import React, { Component } from 'react';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';

const getRecommendedObjectID = (recoIndex, objectID, searchClient) => {
  return searchClient
    .initIndex(recoIndex)
    .getObject(objectID)
    .then((r) => {
      return Promise.resolve(r);
    })
    .catch(() => {
      return Promise.resolve({});
    });
};

function transformRecommendations(res, t) {
  const { props } = t;
  let recoFilters = [];
  if (res.recommendations) {
    recoFilters = res.recommendations
      .reverse()
      .filter((reco) => reco.score > t.state.aiScoreThreshold)
      .map(
        (reco, i) =>
          `objectID:${reco.objectID}<score=${Math.round(reco.score * 100) + i}>`
      );
  }

  const fallbackFilters = props.fallbackFilters ? props.fallbackFilters : '';
  t.setState({
    optionalFilters: [...recoFilters, ...fallbackFilters],
    filters: 'NOT objectID:' + props.objectID,
    facetFilters: props.facetFilters,
    hitsPerPage: props.hitsPerPage
      ? props.hitsPerPage
      : res.recommendations.length,
    res: res,
  });
}

function configWidget(t) {
  const { props } = t;
  switch (props.typeReco) {
    case 'bought-together':
      return getRecommendedObjectID(
        `ai_recommend_bought-together_${props.indexName}`,
        props.objectID,
        props.searchClient
      ).then((res) => {
        return transformRecommendations(res, t);
      });
      break;
    case 'related-products':
      return getRecommendedObjectID(
        `ai_recommend_related-products_${props.indexName}`,
        props.objectID,
        props.searchClient
      ).then((res) => {
        return transformRecommendations(res, t);
      });
      break;
    default:
  }
}
export default class Recommendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aiScoreThreshold: this.props.aiScoreThreshold || 0,
      selectedProduct: this.props.objectID,
      optionalFilters: [],
      clickAnalytics: this.props.clickAnalytics || false,
      analytics: this.props.analytics || false,
      searchClient: this.props.searchClient,
    };
  }

  componentDidMount() {
    configWidget(this);
  }

  componentDidUpdate() {
    if (this.props.objectID === this.state.selectedProduct) {
      return;
    }
    configWidget(this);
    this.setState({ selectedProduct: this.props.objectID });
  }

  render() {
    return (
      <div>
        <InstantSearch
          searchClient={this.props.searchClient}
          indexName={this.props.indexName}
        >
          {this.state.optionalFilters.length > 0 ? (
            <div>
              <Configure
                optionalFilters={this.state.optionalFilters}
                hitsPerPage={this.state.hitsPerPage}
                filters={this.state.filters}
                facetFilters={this.state.facetFilters}
                typoTolerance={false}
                analyticsTags={[`alg-recommend_${this.props.typeReco}`]}
                ruleContexts={[
                  `alg-recommend_${this.props.typeReco}_${this.props.objectID}`,
                ]}
                clickAnalytics={this.state.clickAnalytics}
                analytics={this.state.analytics}
                enableABTest={false}
              />
              <Hits
                hitComponent={({ hit }) =>
                  this.props.hitComponent({
                    setSelectedProduct: this.props.setSelectedProduct,
                    hit,
                    recommendations: this.state.res.recommendations,
                  })
                }
              />
            </div>
          ) : (
            ''
          )}
        </InstantSearch>
      </div>
    );
  }
}
