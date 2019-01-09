import { combineReducers } from "redux";

/**
 * import our reducers here
 */
import TotalsReducer from "./totals_reducer";
import SamplesReducer from "./samples_reducer";
import SeqTypesReducer from "./seqtypes_reducer";
import SeqGroupsReducer from "./seqgroups_reducer";

/**
 * combine the reducers
 */
const rootReducer = combineReducers({
	totals: TotalsReducer,
	samples: SamplesReducer,
	seqtypes: SeqTypesReducer,
	seqgroups: SeqGroupsReducer
});

export default rootReducer;
