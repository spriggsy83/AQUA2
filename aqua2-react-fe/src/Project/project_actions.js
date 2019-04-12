'use-strict';
import * as acts from './project_action_list';
import { getIsLoading } from './project_selectors';
import API from '../common/API';

export function requestProjectDetails() {
	return function(dispatch, getState) {
		if (!getIsLoading(getState())) {
			dispatch({
				type: acts.LOADING,
			});
			API.get(`project`)
				.then((response) => {
					dispatch({
						type: acts.LOADED,
						payload: {
							project: response.data.data[0],
						},
					});
				})
				.catch((error) => {
					dispatch({
						type: acts.ERRORED,
						payload: {
							error: error,
						},
					});
					console.log(error);
				});
		}
	};
}
