"use-strict";
import { isArray } from "lodash";
import * as acts from "./samples_action_list";
import { getIsLoading } from "./samples_selectors";
import API from "../common/API";

export function requestSamples() {
	return function(dispatch, getState) {
		if (!getIsLoading(getState())) {
			dispatch({
				type: acts.LOADING
			});
			API.get(`samples`)
				.then(response => {
					if (isArray(response.data.data)) {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: response.data.total,
								samples: response.data.data,
								error: null
							}
						});
					} else {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: 0,
								samples: [],
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
