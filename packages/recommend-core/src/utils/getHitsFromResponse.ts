import { MultipleQueriesResponse } from '@algolia/client-search';

export function getHitsFromResponse<TObject>(
  response: MultipleQueriesResponse<TObject>
) {
  return response.results.map((result) => result.hits).flat();
}
