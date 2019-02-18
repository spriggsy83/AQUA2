"use-strict";
import * as acts from "./seqstring_action_list";

/**
 * define the initial state of our reducer
 */
const INITIAL_STATE = {
	id: null,
	seqName: null,
	seqLength: null,
	seqType: null,
	loaded: false,
	loading: false,
	error: null,
	seqStr: null,
	subLoaded: false,
	subLoading: false,
	subError: null,
	subseqStr: null,
	subseqStart: null,
	subseqEnd: null
};

/**
 * switch statement checks to see if the dispatched action requires any work from
 * this reducer
 */
export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case acts.CLEAR:
			return {
				...state,
				...INITIAL_STATE
			};
		case acts.NEWFOCUS:
			return {
				...state,
				...INITIAL_STATE,
				id: action.payload.id,
				seqName: action.payload.seqName,
				seqLength: action.payload.seqLength,
				seqType: action.payload.seqType,
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
				seqStr: action.payload.seqStr
			};
		case acts.ERRORED:
			return {
				...state,
				loaded: true,
				loading: false,
				error: action.payload.error,
				seqStr: null
			};
		case acts.NEWSUBRANGE:
			return {
				...state,
				subLoaded: false,
				subLoading: false,
				subError: null,
				subseqStr: null,
				subseqStart: action.payload.subseqStart,
				subseqEnd: action.payload.subseqEnd
			};
		case acts.SUBLOADING:
			return {
				...state,
				subLoading: true
			};
		case acts.SUBLOADED:
			return {
				...state,
				subLoaded: true,
				subLoading: false,
				subError: action.payload.error,
				subseqStr: action.payload.subseqStr
			};
		case acts.SUBERRORED:
			return {
				...state,
				subLoaded: true,
				subLoading: false,
				subError: action.payload.error,
				subseqStr: null
			};
		default:
			return state;
	}
}
