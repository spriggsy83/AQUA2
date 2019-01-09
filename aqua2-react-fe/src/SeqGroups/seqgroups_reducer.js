/**
 * import our action type
 */
import {
	SEQGROUPS_LOADING,
	SEQGROUPS_LOADED
} from "../actions/seqgroups_actions";

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = { loaded: false, total: 0, seqgroups: [] };

/**
 * switch statement checks to see if the dispatched action requires any work from
 * this reducer
 */
export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case SEQGROUPS_LOADING:
			return {
				...state,
				loaded: false
			};
		case SEQGROUPS_LOADED:
			return {
				...state,
				loaded: true,
				total: action.payload.total,
				seqgroups: action.payload.seqgroups
			};
		default:
			return state;
	}
}
