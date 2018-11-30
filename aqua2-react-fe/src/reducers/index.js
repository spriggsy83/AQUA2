import { combineReducers } from "redux";

/**
 * import our reducers here
 */
import SamplesReducer from "./samples_reducer";

/**
 * combine the reducers
 */
const rootReducer = combineReducers({
	samples: SamplesReducer
});

export default rootReducer;
