"use-strict";
import { isArray } from "lodash";
import * as acts from "./oneseq_action_list";
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
			if (
				(id && id !== getSeqID(getState())) ||
				(name && name !== getSeqName(getState()))
			) {
				dispatch({
					type: acts.NEWFOCUS,
					payload: {
						id: id,
						name: name,
						subseqStart: null,
						subseqEnd: null
					}
				});
				doFetch = true;
			} else if (!getIsLoading(getState())) {
				doFetch = true;
			}

			if (doFetch) {
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
						type: acts.LOADED,
						payload: {
							id: seqFromList.id,
							name: seqFromList.name,
							seqDetail: seqFromList,
							subseqStart: subseqStart,
							subseqEnd: subseqEnd,
							error: null
						}
					});
				} else {
					dispatch({
						type: acts.LOADING
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
									type: acts.LOADED,
									payload: {
										id: seqObj.id,
										name: seqObj.name,
										seqDetail: seqObj,
										subseqStart: subseqStart,
										subseqEnd: subseqEnd,
										error: null
									}
								});
							} else {
								dispatch({
									type: acts.LOADED,
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
			}
		}
	};
};
