import { combineReducers } from "redux";

/**
 * import our reducers here
 */
import { reducer as TotalsReducer } from "./Totals";
/*import SamplesReducer from "Samples";
import SeqTypesReducer from "SeqTypes";
import SeqGroupsReducer from "SeqGroups";*/

/**
 * combine the reducers
 */
const rootReducer = combineReducers({
	totals: TotalsReducer
	/*samples: SamplesReducer,
	seqtypes: SeqTypesReducer,
	seqgroups: SeqGroupsReducer*/
});

export default rootReducer;
