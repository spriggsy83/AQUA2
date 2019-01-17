"use-strict";
import { isArray, isEqual } from "lodash";
import * as acts from "./search_action_list";
import {
	getIsLoading,
	getSearchTerm,
	getSearchType,
	getSearchParams
} from "./search_selectors";
import API from "../common/API";

const validSearchTerms = ["seqs", "annots", "all"];

export const requestSearch = ({
	searchTerm = "",
	searchType = "seqs",
	page = 0,
	rowsPerPage = 50,
	orderby = null
} = {}) => {
	const offset = page * rowsPerPage;
	var qParams = {
		limit: rowsPerPage,
		offset: offset
	};
	if (searchType && validSearchTerms.includes(searchType)) {
		qParams["searchtype"] = searchType;
	}
	if (orderby) {
		qParams["sort"] = orderby;
	}
	return function(dispatch, getState) {
		var doFetch = false;
		if (
			searchTerm !== getSearchTerm(getState()) ||
			searchType !== getSearchType(getState())
		) {
			dispatch({
				type: acts.NEWSEARCH,
				payload: {
					searchTerm: searchTerm,
					searchType: searchType
				}
			});
			doFetch = true;
		} else if (
			!isEqual(qParams, getSearchParams(getState())) ||
			!getIsLoading(getState())
		) {
			dispatch({
				type: acts.LOADING
			});
			doFetch = true;
		}
		if (doFetch) {
			API.get(`search/${searchTerm}`, {
				params: qParams
			})
				.then(response => {
					if (isArray(response.data.data)) {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: response.data.total,
								searchResult: response.data.data,
								page: page,
								rowsPerPage: rowsPerPage,
								orderby: orderby,
								error: null
							}
						});
					} else {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: 0,
								searchResult: [],
								page: page,
								rowsPerPage: rowsPerPage,
								orderby: orderby,
								error: "No data found"
							}
						});
					}
				})
				.catch(error => {
					dispatch({
						type: acts.ERRORED,
						payload: {
							error: error
						}
					});
					console.log(error);
				});
		}
	};
};
