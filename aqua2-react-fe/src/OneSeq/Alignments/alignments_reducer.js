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
	columnView: {
		featureType: 'true',
		featureId: 'excluded',
		featureName: 'true',
		seqLength: 'false',
		seqGroupName: 'false',
		seqSampleName: 'false',
		seqTypeName: 'false',
		alignStart: 'false',
		alignEnd: 'false',
		alignCoords: 'true',
		alignStrand: 'false',
		featureAlignStart: 'false',
		featureAlignEnd: 'false',
		featureAlignCoords: 'false',
		source: 'true',
		featureSpecies: 'false',
		featureSource: 'false',
		method: 'false',
		score: 'false',
		featureAnnot: 'true',
		isCdsName: 'false',
		isProtName: 'false',
		subParts: 'true',
	},
};

/**
 * switch statement checks to see if the dispatched action requires any work from
 * this reducer
 */
export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case acts.CLEAR:
			return {
				...INITIAL_STATE,
				columnView: { ...state.columnView },
			};
		case acts.NEWFOCUS:
			return {
				...INITIAL_STATE,
				columnView: { ...state.columnView },
				id: action.payload.id,
				seqName: action.payload.seqName,
				seqLength: action.payload.seqLength,
				subseqStart: action.payload.subseqStart,
				subseqEnd: action.payload.subseqEnd,
			};
		case acts.NEWSUBRANGE:
			return {
				...state,
				columnView: { ...state.columnView },
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
				columnView: { ...state.columnView },
				loaded: false,
				loading: false,
				error: action.payload.error,
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
