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

const scoredObjectID = (objectID, score) =>
  `objectID:${objectID}<score=${score}>`;

const buildSearchParamsFromRecommendations_TEMPORARY_BETA = (record, props) => {
  let recoFilters;
  let hitsPerPage;
  const maxRecommendations = props.maxRecommendations || 0;
  const threshold = props.threshold || 0;
  const fallbackFilters = props.fallbackFilters || [];
  const hasFallback = fallbackFilters.length > 0;

  if (record.recommendations) {
    recoFilters = record.recommendations
      .reverse()
      .filter((reco) => reco.score > threshold)
      .map((reco, i) =>
        scoredObjectID(reco.objectID, Math.round(reco.score * 100) + i)
      );

    // recommendations and fallback, force to retrieve maxRecommendations hits
    if (hasFallback) {
      hitsPerPage = maxRecommendations;
    } else {
      // otherwise max the hits retrieved with maxRecommendations
      hitsPerPage = Math.min(record.recommendations.length, maxRecommendations);
    }
  } else {
    recoFilters = [];

    // no recommendations but fallback, force to retrieve maxRecommendations hits
    if (hasFallback) {
      hitsPerPage = maxRecommendations;
    } else {
      // otherwise, don't retrieve anything
      hitsPerPage = 0;
    }
  }

  return {
    optionalFilters: [...recoFilters, ...fallbackFilters],
    filters: `NOT objectID:${props.objectID}`,
    facetFilters: props.facetFilters,
    hitsPerPage,
  };
};

export class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      params: {
        optionalFilters: [],
        filters: [],
        facetFilters: [],
        hitsPerPage: 0,
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
  maxRecommendations: PropTypes.number,
  clickAnalytics: PropTypes.bool,
  analytics: PropTypes.bool,
  threshold: PropTypes.number,
};
