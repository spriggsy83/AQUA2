"use-strict";
import { isArray } from "lodash";
import * as seqDetailActs from "./oneseq_action_list";
import {
	actsList as seqStringActs,
	selectors as seqStringSelectors
} from "./SeqString";
import { getIsLoading, getSeqID, getSeqName } from "./oneseq_selectors";
import { selectors as seqsSelectors } from "../Sequences";
import { selectors as searchSelectors } from "../Search";
import API from "../common/API";

export const requestOneSeq = ({
	name = null,
	id = null,
	subseqStart = null,
	subseqEnd = null
} = {}) => {
	return function(dispatch, getState) {
		if (id || name) {
			var doFetch = false;
			// If id/name not current, set new and do fetch
			if (
				(id && id !== getSeqID(getState())) ||
				(name && name !== getSeqName(getState()))
			) {
				dispatch({
					type: seqDetailActs.NEWFOCUS,
					payload: {
						id: id,
						name: name
					}
				});
				doFetch = true;
			} else {
				// If id/name ARE current, but not loading, do fecth
				if (!getIsLoading(getState())) {
					doFetch = true;
				}

				// If id/name ARE current, but a sub-seq range passed in,
				// pass range down to child feature parts
				if (
					(subseqStart &&
						subseqStart !== seqStringSelectors.getSubseqStart(getState())) ||
					(subseqEnd &&
						subseqEnd !== seqStringSelectors.getSubseqEnd(getState()))
				) {
					dispatch({
						type: seqStringActs.NEWSUBRANGE,
						payload: {
							subseqStart: subseqStart,
							subseqEnd: subseqEnd
						}
					});
				}
			}

			if (doFetch) {
				// If fetching, clear child feature parts
				dispatch({
					type: seqStringActs.CLEAR
				});
				// First see if seq available in sequence list or search result
				var seqFromList = null;
				if (name) {
					seqFromList = seqsSelectors.getSeqByName(getState(), name);
					if (!seqFromList) {
						seqFromList = searchSelectors.getSeqByName(getState(), name);
					}
				} else if (id) {
					seqFromList = seqsSelectors.getSeqByID(getState(), id);
					if (!seqFromList) {
						seqFromList = searchSelectors.getSeqByID(getState(), id);
					}
				}
				if (seqFromList) {
					if (!subseqStart) {
						subseqStart = 1;
					}
					if (!subseqEnd) {
						subseqEnd = seqFromList["length"];
					}
					dispatch({
						type: seqDetailActs.LOADED,
						payload: {
							id: seqFromList.id,
							name: seqFromList.name,
							seqDetail: seqFromList,
							error: null
						}
					});
					dispatch({
						type: seqStringActs.NEWFOCUS,
						payload: {
							id: seqFromList.id,
							seqName: seqFromList.name,
							seqLength: seqFromList["length"],
							subseqStart: subseqStart,
							subseqEnd: subseqEnd
						}
					});
				} else {
					// Else, do API fetch
					dispatch({
						type: seqDetailActs.LOADING
					});

					API.get(`sequences/` + (id ? id : name))
						.then(response => {
							if (isArray(response.data.data)) {
								var seqObj = response.data.data[0];
								if (!subseqStart) {
									subseqStart = 1;
								}
								if (!subseqEnd) {
									subseqEnd = seqObj["length"];
								}
								dispatch({
									type: seqDetailActs.LOADED,
									payload: {
										id: seqObj.id,
										name: seqObj.name,
										seqDetail: seqObj,
										error: null
									}
								});
								dispatch({
									type: seqStringActs.NEWFOCUS,
									payload: {
										id: seqObj.id,
										seqName: seqObj.name,
										seqLength: seqObj["length"],
										subseqStart: subseqStart,
										subseqEnd: subseqEnd
									}
								});
							} else {
								dispatch({
									type: seqDetailActs.LOADED,
									payload: {
										id: id ? id : null,
										name: name ? name : null,
										seqDetail: null,
										subseqStart: null,
										subseqEnd: null,
										error:
											"No data found for sequence '" + (id ? id : name) + "'"
									}
								});
								dispatch({
									type: seqStringActs.CLEAR
								});
							}
						})
						.catch(error => {
							dispatch({
								type: seqDetailActs.ERRORED,
								payload: {
									error: error
								}
							});
							dispatch({
								type: seqStringActs.CLEAR
							});
							console.log(error);
						});
				}
			}
		}
	};
};
