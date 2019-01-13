"use-strict";
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
					dispatch({
						type: acts.LOADED,
						payload: {
							total: response.data.total,
							seqgroups: response.data.data
						}
					});
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
