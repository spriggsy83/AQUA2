import { combineReducers } from "redux";

/**
 * import our reducers here
 */
import TotalsReducer from "./totals_reducer";
import SamplesReducer from "./samples_reducer";

/**
 * combine the reducers
 */
const rootReducer = combineReducers({
	totals: TotalsReducer,
	samples: SamplesReducer
});

export default rootReducer;
