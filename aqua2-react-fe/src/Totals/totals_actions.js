"use-strict";
import API from "common/API";

export const TOTALS_LOADING = "TOTALS_LOADING";
export const TOTALS_LOADED = "TOTALS_LOADED";

export function getTotals() {
	return function(dispatch) {
		dispatch({
			type: "TOTALS_LOADING"
		});
		API.get(`totals`)
			.then(response => {
				dispatch({
					type: "TOTALS_LOADED",
					payload: {
						totals: response.data.data[0]
					}
				});
				//return response;
			})
			.catch(error => {
				console.log(error);
			});
	};
}

export default {
	getTotals
};

