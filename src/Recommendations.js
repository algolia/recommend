import React, { Component } from "react";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";

const getRecommendedObject = (recoIndex, objectID, searchClient) => {
  return searchClient
    .initIndex(recoIndex)
    .getObject(objectID)
    .catch(() => {
      // not fatal, no recommendations for this object
      return {};
    });
};

function buildSearchParamsFromRecommendations(record, props) {
  let recoFilters = [];
  let hitsPerPage = props.hitsPerPage;
  const threshold = props.aiScoreThreshold || 0;

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
}

function configWidget(t) {
  const { props } = t;
  let index;

  if (props.model === "bought-together") {
    index = `ai_recommend_bought-together_${props.indexName}`;
  } else if (props.model === "related-products") {
    index = `ai_recommend_related-products_${props.indexName}`;
  } else {
    throw new Error(`Unknown model '${props.model}'.`);
  }

  return getRecommendedObject(index, props.objectID, props.searchClient).then(
    (record) => {
      const params = buildSearchParamsFromRecommendations(record, props);
      t.setState({ ...t.state, params });
    }
  );
}

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
    };
  }

  componentDidMount() {
    configWidget(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      configWidget(this);
    }
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
          <Hits hitComponent={this.props.hitComponent} />
        </InstantSearch>
      </div>
    );
  }
}
