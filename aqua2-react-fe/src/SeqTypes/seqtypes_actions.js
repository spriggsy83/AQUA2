"use-strict";
import API from "../API";

export const SEQTYPES_LOADING = "SEQTYPES_LOADING";
export const SEQTYPES_LOADED = "SEQTYPES_LOADED";

export function getSeqTypes() {
	return function(dispatch) {
		dispatch({
			type: "SEQTYPES_LOADING"
		});
		API.get(`seqtypes`)
			.then(response => {
				dispatch({
					type: "SEQTYPES_LOADED",
					payload: {
						total: response.data.total,
						seqtypes: response.data.data
					}
				});
				//return response;
			})
			.catch(error => {
				console.log(error);
			});
	};
}
