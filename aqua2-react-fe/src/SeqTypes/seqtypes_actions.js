"use-strict";
import * as acts from "./seqtypes_action_list";
import { getIsLoading } from "./seqtypes_selectors";
import API from "../common/API";

export function requestSeqTypes() {
	return function(dispatch, getState) {
		if (!getIsLoading(getState())) {
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
