'use-strict';
import * as acts from './alignments_action_list';

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = {
	id: null,
	seqName: null,
	seqLength: null,
	subseqStart: null,
	subseqEnd: null,
	loaded: false,
	loading: false,
	error: null,
	total: 0,
	alignments: [],
	page: 0,
	rowsPerPage: 100,
	orderby: null,
	filtersSet: {},
};

/**
 * switch statement checks to see if the dispatched action requires any work from
 * this reducer
 */
export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case acts.CLEAR:
			return {
				...state,
				...INITIAL_STATE,
			};
		case acts.NEWFOCUS:
			return {
				...state,
				...INITIAL_STATE,
				id: action.payload.id,
				seqName: action.payload.seqName,
				seqLength: action.payload.seqLength,
				subseqStart: action.payload.subseqStart,
				subseqEnd: action.payload.subseqEnd,
			};
		case acts.NEWSUBRANGE:
			return {
				...state,
				loaded: false,
				loading: false,
				error: null,
				alignments: [],
				total: 0,
				page: 0,
				subseqStart: action.payload.subseqStart,
				subseqEnd: action.payload.subseqEnd,
			};
		case acts.LOADING:
			return {
				...state,
				loading: true,
			};
		case acts.LOADED:
			return {
				...state,
				loaded: true,
				loading: false,
				error: action.payload.error,
				total: action.payload.total,
				alignments: action.payload.alignments,
				page: action.payload.page,
				rowsPerPage: action.payload.rowsPerPage,
				orderby: action.payload.orderby,
				filtersSet: action.payload.filtersSet,
				subseqStart: action.payload.subseqStart,
				subseqEnd: action.payload.subseqEnd,
			};
		case acts.ERRORED:
			return {
				...state,
				loaded: false,
				loading: false,
				error: action.payload.error,
			};
		default:
			return state;
	}
}
