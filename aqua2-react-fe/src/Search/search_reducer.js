'use-strict';
import * as acts from './search_action_list';

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = {
	loaded: false,
	loading: false,
	error: null,
	total: 0,
	searchTerm: '',
	searchType: 'seqs',
	searchResult: [],
	page: 0,
	rowsPerPage: 100,
	orderby: null,
	dlUrl: null,
	dlFastaUrl: null,
	columnView: {
		resultType: 'true',
		seqId: 'excluded',
		seqName: 'true',
		seqLength: 'false',
		seqGroupName: 'false',
		seqSampleName: 'false',
		seqTypeName: 'false',
		extLink: 'false',
		alignName: 'true',
		featureLength: 'true',
		alignStart: 'false',
		alignEnd: 'false',
		alignStrand: 'false',
		source: 'true',
		alignSpecies: 'false',
		alignSource: 'false',
		alignMethod: 'false',
		alignScore: 'false',
		annotation: 'true',
	},
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
				columnView: { ...state.columnView },
				loading: true,
				loaded: false,
				error: null,
				total: 0,
				searchResult: [],
				searchTerm: action.payload.searchTerm,
				searchType: action.payload.searchType,
				dlUrl: null,
				dlFastaUrl: null,
			};
		case acts.LOADING:
			return {
				...state,
				columnView: { ...state.columnView },
				loading: true,
			};
		case acts.LOADED:
			return {
				...state,
				columnView: { ...state.columnView },
				loaded: true,
				loading: false,
				error: action.payload.error,
				total: action.payload.total,
				searchResult: action.payload.searchResult,
				page: action.payload.page,
				rowsPerPage: action.payload.rowsPerPage,
				orderby: action.payload.orderby,
				dlUrl: action.payload.dlUrl,
				dlFastaUrl: action.payload.dlFastaUrl,
			};
		case acts.ERRORED:
			return {
				...state,
				columnView: { ...state.columnView },
				loaded: false,
				loading: false,
				total: 0,
				searchResult: [],
				error: action.payload.error,
				dlUrl: null,
				dlFastaUrl: null,
			};
		case acts.COLVIEWCHANGE:
			return {
				...state,
				columnView: {
					...state.columnView,
					[action.payload.column]: action.payload.value,
				},
			};
		default:
			return state;
	}
}
