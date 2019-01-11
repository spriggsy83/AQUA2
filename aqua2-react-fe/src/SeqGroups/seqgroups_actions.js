"use-strict";
import * as acts from "./seqgroups_action_list";
import API from "../common/API";

export function requestSeqGroups() {
	return function(dispatch) {
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
				console.log(error);
			});
	};
}
