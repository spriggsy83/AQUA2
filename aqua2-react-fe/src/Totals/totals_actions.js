"use-strict";
import * as acts from "./totals_action_list";
import API from "../common/API";

export function requestTotals() {
	return function(dispatch) {
		dispatch({
			type: acts.LOADING
		});
		API.get(`totals`)
			.then(response => {
				dispatch({
					type: acts.LOADED,
					payload: {
						totals: response.data.data[0]
					}
				});
			})
			.catch(error => {
				console.log(error);
			});
	};
}
