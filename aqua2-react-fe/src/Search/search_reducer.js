"use-strict";
import * as acts from "./search_action_list";

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = {
	loaded: false,
	loading: false,
	error: null,
	total: 0,
	searchTerm: "",
	searchType: "seqs",
	searchResult: [],
	page: 0,
	rowsPerPage: 100,
	orderby: null
};

/**
 * switch statement checks to see if the dispatched action requires any work from
 * this reducer
 */
export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case acts.NEWSEARCH:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null,
				total: 0,
				searchResult: [],
				searchTerm: action.payload.searchTerm,
				searchType: action.payload.searchType
			};
		case acts.LOADING:
			return {
				...state,
				loading: true
			};
		case acts.LOADED:
			return {
				...state,
				loaded: true,
				loading: false,
				error: action.payload.error,
				total: action.payload.total,
				searchResult: action.payload.searchResult,
				page: action.payload.page,
				rowsPerPage: action.payload.rowsPerPage,
				orderby: action.payload.orderby
			};
		case acts.ERRORED:
			return {
				...state,
				loaded: false,
				loading: false,
				total: 0,
				searchResult: [],
				error: action.payload.error
			};
		default:
			return state;
	}
}
