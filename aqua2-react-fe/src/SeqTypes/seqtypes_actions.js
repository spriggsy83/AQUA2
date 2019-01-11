"use-strict";
import * as acts from "./seqtypes_action_list";
import API from "../common/API";

export function requestSeqTypes() {
	return function(dispatch) {
		dispatch({
			type: acts.LOADING
		});
		API.get(`seqtypes`)
			.then(response => {
				dispatch({
					type: acts.LOADED,
					payload: {
						total: response.data.total,
						seqtypes: response.data.data
					}
				});
			})
			.catch(error => {
				console.log(error);
			});
	};
}
