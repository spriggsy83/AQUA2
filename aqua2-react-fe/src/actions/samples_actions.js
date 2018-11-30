"use-strict";
import API from "../API";

export const SAMPLES_LOADING = "SAMPLES_LOADING";
export const SAMPLES_LOADED = "SAMPLES_LOADED";

export function getSamples() {
	return function(dispatch) {
		dispatch({
			type: "SAMPLES_LOADING"
		});
		API.get(`samples`)
			.then(response => {
				dispatch({
					type: "SAMPLES_LOADED",
					payload: {
						total: response.data.total,
						samples: response.data.data
					}
				});
				//return response;
			})
			.catch(error => {
				console.log(error);
			});
	};
}
