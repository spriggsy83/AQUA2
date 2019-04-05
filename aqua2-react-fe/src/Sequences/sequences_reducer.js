'use-strict';
import * as acts from './sequences_action_list';

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = {
	loaded: false,
	loading: false,
	error: null,
	total: 0,
	sequences: [],
	page: 0,
	rowsPerPage: 100,
	orderby: null,
	filtersSet: {},
	dlUrl: null,
	dlFastaUrl: null,
	columnView: {
		id: 'excluded',
		name: 'true',
		length: 'true',
		groupId: 'excluded',
		groupName: 'true',
		sampleId: 'excluded',
		sampleName: 'true',
		typeId: 'excluded',
		typeName: 'true',
		annotNote: 'true',
		extLinkAhref: 'true',
		extLink: 'excluded',
		extLinkLabel: 'excluded',
	},
};

/**
 * switch statement checks to see if the dispatched action requires any work from
 * this reducer
 */
export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
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
				sequences: action.payload.sequences,
				page: action.payload.page,
				rowsPerPage: action.payload.rowsPerPage,
				orderby: action.payload.orderby,
				filtersSet: action.payload.filtersSet,
				dlUrl: action.payload.dlUrl,
				dlFastaUrl: action.payload.dlFastaUrl,
			};
		case acts.ERRORED:
			return {
				...state,
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
