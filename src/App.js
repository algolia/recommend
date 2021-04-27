import React, { Component } from "react";
import {
  InstantSearch,
  Highlight,
  Configure,
  connectHitInsights,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch";
import Recommendations from "./Recommendations.js";
import Autocomplete from "./Autocomplete";
import "./App.css";

const aa = require("search-insights");
aa("init", {
  appId: "HYDY1KWTWB",
  apiKey: "28cf6d38411215e2eef188e635216508",
});

const searchClient = algoliasearch(
  "HYDY1KWTWB",
  "28cf6d38411215e2eef188e635216508"
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProduct: undefined,
    };
  }

  onSuggestionSelected = (_, { suggestion }) => {
    this.setState({
      selectedProduct: suggestion,
    });
  };

  render() {
    return (
      <div className="ais-InstantSearch">
        <h1>React InstantSearch Algolia Recommend Demo</h1>
        <InstantSearch indexName="gstar_demo_test" searchClient={searchClient}>
          <Configure hitsPerPage={5} />
          <h3>Looking for Recommendations?</h3>
          <Autocomplete
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionCleared={this.onSuggestionCleared}
          />
        </InstantSearch>
        {this.state.selectedProduct && (
          <>
            <h3>Frequently Bought Together</h3>
            <Recommendations
              model="bought-together"
              searchClient={searchClient}
              indexName={"gstar_demo_test"}
              objectID={this.state.selectedProduct.objectID}
              hitComponent={(props) => HitWithInsights(props)}
              hitsPerPage={3}
              clickAnalytics={true}
              analytics={true}
            />

            <h3>Related Products</h3>
            <Recommendations
              model="related-products"
              searchClient={searchClient}
              indexName={"gstar_demo_test"}
              objectID={this.state.selectedProduct.objectID}
              hitComponent={(props) => HitWithInsights(props)}
              hitsPerPage={5}
              facetFilters={[
                `hierarchical_categories.lvl0:${this.state.selectedProduct.hierarchical_categories.lvl0}`,
              ]}
              fallbackFilters={[
                `hierarchical_categories.lvl2:${this.state.selectedProduct.hierarchical_categories.lvl2}`,
              ]}
              clickAnalytics={true}
              analytics={true}
            />
          </>
        )}
      </div>
    );
  }
}

const RecoHitsWithInsights = ({ hit, insights }) => {
  return (
    <div>
      <img src={hit.image_link} align="left" alt={hit.name} width={100} />
      <div className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="hit-objectID">
        <p>
          {hit.objectID} (score={hit._recommendScore})
        </p>
      </div>
      <div className="hit-price">${hit.price}</div>
      <button
        onClick={() =>
          insights("clickedObjectIDsAfterSearch", {
            eventName: "Product Clicked",
          })
        }
      >
        See details
      </button>
      <button
        onClick={() =>
          insights("convertedObjectIDsAfterSearch", {
            eventName: "Product Added To Cart",
          })
        }
      >
        Add to cart
      </button>
    </div>
  );
};

const HitWithInsights = connectHitInsights(aa)(RecoHitsWithInsights);

export default App;
