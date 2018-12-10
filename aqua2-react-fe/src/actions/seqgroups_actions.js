"use-strict";
import API from "../API";

export const SEQGROUPS_LOADING = "SEQGROUPS_LOADING";
export const SEQGROUPS_LOADED = "SEQGROUPS_LOADED";

export function getSeqGroups() {
	return function(dispatch) {
		dispatch({
			type: "SEQGROUPS_LOADING"
		});
		API.get(`seqgroups`)
			.then(response => {
				dispatch({
					type: "SEQGROUPS_LOADED",
					payload: {
						total: response.data.total,
						seqgroups: response.data.data
					}
				});
				//return response;
			})
			.catch(error => {
				console.log(error);
			});
	};
}
