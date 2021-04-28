import React, { Component } from "react";
import PropTypes from "prop-types";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";

// BY RE-USING OR UPDATING THIS CODE YOU UNDERSTAND
// THAT WILL ONLY BY VALID FOR THE *BETA* VERSION OF ALGOLIA RECOMMEND
//
// ONCE FULLY RELEASE, ALGOLIA RECOMMEND WILL HAVE ITS OWN ENDPOINTS
// AND NOT ANYMORE RELY ON THE SEARCH API

const getRecommendedObject_TEMPORARY_BETA = (
  model,
  indexName,
  objectID,
  searchClient
) => {
  let index;

  if (model === "bought-together") {
    index = `ai_recommend_bought-together_${indexName}`;
  } else if (model === "related-products") {
    index = `ai_recommend_related-products_${indexName}`;
  } else {
    throw new Error(`Unknown model '${model}'.`);
  }

  return searchClient
    .initIndex(index)
    .getObject(objectID)
    .catch(() => {
      // not fatal, no recommendations for this object
      return {};
    });
};

const buildSearchParamsFromRecommendations_TEMPORARY_BETA = (record, props) => {
  let recoFilters = [];
  let hitsPerPage = props.hitsPerPage;
  const threshold = props.threshold || 0;

  if (record.recommendations) {
    recoFilters = record.recommendations
      .reverse()
      .filter((reco) => reco.score > threshold)
      .map(
        (reco, i) =>
          `objectID:${reco.objectID}<score=${Math.round(reco.score * 100) + i}>`
      );

    if (!hitsPerPage) {
      hitsPerPage = record.recommendations.length;
    }
  }

  return {
    optionalFilters: [...recoFilters, ...(props.fallbackFilters || [])],
    filters: "NOT objectID:" + props.objectID,
    facetFilters: props.facetFilters,
    hitsPerPage: hitsPerPage,
  };
};

export default class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      params: {
        optionalFilters: [],
        filters: [],
        facetFilters: [],
        hitsPerPage: this.props.hitsPerPage,
      },
      searchClient: this.props.searchClient,
      objectID: this.props.objectID,
      recommendations: [],
    };
  }

  componentDidMount() {
    this._configWidget();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this._configWidget();
    }
  }

  _configWidget() {
    const { props } = this;

    return getRecommendedObject_TEMPORARY_BETA(
      props.model,
      props.indexName,
      props.objectID,
      props.searchClient
    ).then((record) => {
      const params = buildSearchParamsFromRecommendations_TEMPORARY_BETA(
        record,
        props
      );
      this.setState({
        ...this.state,
        params,
        recommendations: record.recommendations || [],
      });
    });
  }

  render() {
    return (
      <div>
        <InstantSearch
          searchClient={this.props.searchClient}
          indexName={this.props.indexName}
        >
          <Configure
            optionalFilters={this.state.params.optionalFilters}
            hitsPerPage={this.state.params.hitsPerPage}
            filters={this.state.params.filters}
            facetFilters={this.state.params.facetFilters}
            typoTolerance={false}
            analyticsTags={[`alg-recommend_${this.props.model}`]}
            ruleContexts={[
              `alg-recommend_${this.props.model}_${this.props.objectID}`,
            ]}
            clickAnalytics={this.props.clickAnalytics || false}
            analytics={this.props.analytics || false}
            enableABTest={false}
          />
          <Hits
            hitComponent={({ hit }) => {
              const recommendation = this.state.recommendations.find(
                (e) => e.objectID === hit.objectID
              );
              hit._recommendScore = recommendation && recommendation.score;
              return this.props.hitComponent({ hit });
            }}
          />
        </InstantSearch>
      </div>
    );
  }
}

Recommendations.propTypes = {
  model: PropTypes.string.isRequired,
  searchClient: PropTypes.object.isRequired,
  indexName: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  hitComponent: PropTypes.elementType.isRequired,
  hitsPerPage: PropTypes.number,
  clickAnalytics: PropTypes.bool,
  analytics: PropTypes.bool,
  threshold: PropTypes.number,
};
