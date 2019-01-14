"use-strict";
import * as acts from "./totals_action_list";
import { getIsLoading } from "./totals_selectors";
import API from "../common/API";

export function requestTotals() {
	return function(dispatch, getState) {
		if (!getIsLoading(getState())) {
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
