import { createSelector } from "reselect";

export const getStateSlice = state => state.search;

export const getSearchTerm = state => state.search.searchTerm;
export const getSearchType = state => state.search.searchType;

export const getHasLoaded = state => state.search.loaded;
export const getIsLoading = state => state.search.loading;
export const getError = state => state.search.error;
export const getCount = state => state.search.total;
export const getSearchResult = state => state.search.searchResult;

/* Result table params */
export const getTablePage = state => state.search.page;
export const getTableRows = state => state.search.rowsPerPage;
export const getTableSort = state => state.search.orderby;

export const getSearchParams = createSelector(
	getTablePage,
	getTableRows,
	getTableSort,
	getSearchType,
	(page, rowsPerPage, orderby, searchType) => {
		var qParams = {
			limit: rowsPerPage,
			offset: page * rowsPerPage
		};
		if (searchType) {
			qParams["searchtype"] = searchType;
		}
		if (orderby) {
			qParams["sort"] = orderby;
		}
		return qParams;
	}
);

export const getSearchTable = createSelector(getSearchResult, searchRes => {
	if (searchRes.length) {
		return [];
	} else {
		return [];
	}
});
