import { combineReducers } from "redux";

/**
 * import our reducers here
 */
import { reducer as TotalsReducer } from "./Totals";
import { reducer as SamplesReducer } from "./Samples";
import { reducer as SeqTypesReducer } from "./SeqTypes";
import { reducer as SeqGroupsReducer } from "./SeqGroups";
import { reducer as SequencesReducer } from "./Sequences";

/**
 * combine the reducers
 */
const rootReducer = combineReducers({
	totals: TotalsReducer,
	samples: SamplesReducer,
	seqtypes: SeqTypesReducer,
	seqgroups: SeqGroupsReducer,
	sequences: SequencesReducer
});

export default rootReducer;
