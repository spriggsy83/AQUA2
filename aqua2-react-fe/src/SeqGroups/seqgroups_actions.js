"use-strict";
import { isArray } from "lodash";
import * as acts from "./seqgroups_action_list";
import { getIsLoading } from "./seqgroups_selectors";
import API from "../common/API";

export function requestSeqGroups() {
	return function(dispatch, getState) {
		if (!getIsLoading(getState())) {
			dispatch({
				type: acts.LOADING
			});
			API.get(`seqgroups`)
				.then(response => {
					if (isArray(response.data.data)) {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: response.data.total,
								seqgroups: response.data.data
							}
						});
					} else {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: 0,
								seqgroups: [],
								error: "No data found"
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
}
