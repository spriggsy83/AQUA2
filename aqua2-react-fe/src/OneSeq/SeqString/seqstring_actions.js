"use-strict";
import { isArray } from "lodash";
import * as acts from "./seqstring_action_list";
import {
	getSeqID,
	getHasLoaded,
	getSubseqStart,
	getSubseqEnd,
	getSubseqFromSeq
} from "./seqstring_selectors";
import API from "../../common/API";

export const requestSeqString = () => {
	return function(dispatch, getState) {
		var seqId = getSeqID(getState());
		if (seqId) {
			dispatch({
				type: acts.LOADING
			});

			API.get(`seqstring/` + seqId)
				.then(response => {
					if (isArray(response.data.data)) {
						var seqStr = response.data.data[0].seqstring;
						dispatch({
							type: acts.LOADED,
							payload: {
								seqStr: seqStr,
								error: null
							}
						});
					} else {
						dispatch({
							type: acts.LOADED,
							payload: {
								seqStr: null,
								error:
									"No sequence string data found for sequence '" + seqId + "'"
							}
						});
					}
				})
				.catch(error => {
					dispatch({
						type: acts.ERRORED,
						payload: {
							error: error
						}
					});
					console.log(error);
				});
		}
	};
};

export const requestSubseqString = ({
	subseqStart = null,
	subseqEnd = null
} = {}) => {
	return function(dispatch, getState) {
		var seqId = getSeqID(getState());
		var start = subseqStart ? subseqStart : getSubseqStart(getState());
		var end = subseqEnd ? subseqEnd : getSubseqEnd(getState());

		if (seqId && start && end) {
			if (start > end) {
				[start, end] = [end, start];
			}
			if (
				start !== getSubseqStart(getState()) ||
				end !== getSubseqEnd(getState())
			) {
				dispatch({
					type: acts.NEWSUBRANGE,
					payload: {
						subseqStart: start,
						subseqEnd: end
					}
				});
			}

			var doFetch = true;

			// If full seq is loaded, extract subseq from it
			if (getHasLoaded(getState())) {
				const substrFromFullStr = getSubseqFromSeq(getState(), start, end);
				if (substrFromFullStr) {
					dispatch({
						type: acts.SUBLOADED,
						payload: {
							subseqStr: substrFromFullStr,
							subError: null
						}
					});
					doFetch = false;
				}
			}

			// Else, can fetch subseq from API
			if (doFetch) {
				dispatch({
					type: acts.SUBLOADING
				});

				var subLength = end - start + 1;
				API.get(`seqstring/` + seqId, {
					params: { start: start, length: subLength }
				})
					.then(response => {
						if (isArray(response.data.data)) {
							var subseqStr = response.data.data[0].seqstring;
							dispatch({
								type: acts.SUBLOADED,
								payload: {
									subseqStr: subseqStr,
									subError: null
								}
							});
						} else {
							dispatch({
								type: acts.SUBLOADED,
								payload: {
									subseqStr: null,
									subError:
										"No sequence string data found for sequence '" + seqId + "'"
								}
							});
						}
					})
					.catch(error => {
						dispatch({
							type: acts.SUBERRORED,
							payload: {
								subError: error
							}
						});
						console.log(error);
					});
			}
		}
	};
};
