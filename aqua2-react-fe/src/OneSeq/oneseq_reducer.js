"use-strict";
import { combineReducers } from "redux";
import { reducer as SeqstringReducer } from "./SeqString";
import * as acts from "./oneseq_action_list";

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = {
	loaded: false,
	loading: false,
	error: null,
	id: null,
	name: null,
	seqDetail: null,
	subseqStart: null,
	subseqEnd: null
};

function OneseqReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case acts.NEWFOCUS:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null,
				seqDetail: null,
				id: action.payload.id,
				name: action.payload.name,
				subseqStart: action.payload.subseqStart,
				subseqEnd: action.payload.subseqEnd
			};
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
				error: action.payload.error,
				id: action.payload.id,
				name: action.payload.name,
				seqDetail: action.payload.seqDetail,
				subseqStart: action.payload.subseqStart,
				subseqEnd: action.payload.subseqEnd
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

/**
 * Export this reducer combined with sub-part reducers
 */
export default combineReducers({
	seqstring: SeqstringReducer,
	seqdetail: OneseqReducer
});
