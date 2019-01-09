/**
 * import our action type
 */
import { SAMPLES_LOADING, SAMPLES_LOADED } from "./samples_actions.js";

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = { loaded: false, total: 0, samples: [] };

/**
 * switch statement checks to see if the dispatched action requires any work from
 * this reducer
 */
export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case SAMPLES_LOADING:
			return {
				...state,
				loaded: false
			};
		case SAMPLES_LOADED:
			return {
				...state,
				loaded: true,
				total: action.payload.total,
				samples: action.payload.samples
			};
		default:
			return state;
	}
}
