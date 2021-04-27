# @algolia/react-recommendations

This is the repository packaging the temporary Algolia Recommend React component as well as an Algolia Recommend demo.

## Props

```jsx
<Recommendations
  searchClient={searchClient}
  model={"related-products" | "bought-together"}
  indexName={"your_source_index_name"}
  objectID={currentObjectID}
  hitComponent={(props) => Hit(props)}
  hitsPerPage={5}
  facetFilters={[]}
  fallbackFilters={[]}
  analytics={true | false}
  clickAnalytics={true | false}
/>
```

## Development

To run this project locally, install the dependencies and run the local server:

```sh
yarn
yarn start
```

Open http://localhost:3000 to see your app.
