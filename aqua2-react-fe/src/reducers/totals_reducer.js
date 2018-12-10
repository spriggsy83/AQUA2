/**
 * import our action type
 */
import { TOTALS_LOADING, TOTALS_LOADED } from "../actions/totals_actions";

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = { loaded: false, totals: [] };

/**
 * switch statement checks to see if the dispatched action requires any work from
 * this reducer
 */
export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case TOTALS_LOADING:
			return {
				...state,
				loaded: false
			};
		case TOTALS_LOADED:
			return {
				...state,
				loaded: true,
				totals: action.payload.totals
			};
		default:
			return state;
	}
}
