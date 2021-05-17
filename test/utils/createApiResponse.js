export function createSingleSearchResponse(subset = {}) {
    const { query = '', page = 0, hitsPerPage = 20, hits = [], nbHits = hits.length, nbPages = Math.ceil(nbHits / hitsPerPage), params = '', exhaustiveNbHits = true, exhaustiveFacetsCount = true, processingTimeMS = 0, ...rest } = subset;
    return {
        page,
        hitsPerPage,
        nbHits,
        nbPages,
        processingTimeMS,
        hits,
        query,
        params,
        exhaustiveNbHits,
        exhaustiveFacetsCount,
        ...rest,
    };
}
export function createMultiSearchResponse(...args) {
    if (!args.length) {
        return {
            results: [createSingleSearchResponse()],
        };
    }
    return {
        results: args.map(createSingleSearchResponse),
    };
}
export function createSFFVResponse(args = {}) {
    return {
        facetHits: [],
        exhaustiveFacetsCount: true,
        processingTimeMS: 1,
        ...args,
    };
}
