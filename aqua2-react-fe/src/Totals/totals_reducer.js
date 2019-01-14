"use-strict";
import * as acts from "./totals_action_list";

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = {
	loaded: false,
	loading: false,
	error: null,
	totals: []
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
				loading: true
			};
		case acts.LOADED:
			return {
				...state,
				loaded: true,
				loading: false,
				error: null,
				totals: action.payload.totals
			};
		case acts.ERRORED:
			return {
				...state,
				loaded: false,
				loading: false,
				error: action.payload.error
			};
		default:
			return state;
	}
}
