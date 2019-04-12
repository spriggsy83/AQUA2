'use-strict';
import * as acts from './project_action_list';

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = {
	loaded: false,
	loading: false,
	error: null,
	project: {
		shortTitle: '',
		longTitle: '',
		description: '',
		contacts: '',
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
				error: null,
				project: {
					shortTitle: action.payload.project.shortTitle || '',
					longTitle: action.payload.project.longTitle || '',
					description: action.payload.project.description || '',
					contacts: action.payload.project.contacts || '',
				},
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
