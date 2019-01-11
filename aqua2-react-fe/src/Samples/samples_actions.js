"use-strict";
import * as acts from "./samples_action_list";
import API from "../common/API";

export function requestSamples() {
	return function(dispatch) {
		dispatch({
			type: acts.LOADING
		});
		API.get(`samples`)
			.then(response => {
				dispatch({
					type: acts.LOADED,
					payload: {
						total: response.data.total,
						samples: response.data.data
					}
				});
			})
			.catch(error => {
				console.log(error);
			});
	};
}
