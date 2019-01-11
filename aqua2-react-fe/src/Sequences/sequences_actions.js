"use-strict";
import { isEmpty } from "lodash";
import * as acts from "./sequences_action_list";
import API from "../common/API";

export const requestSequences = ({
	page = 0,
	rowsPerPage = 50,
	orderby = null,
	filtersSet = {},
	filterOpts = {}
} = {}) => {
	const offset = page * rowsPerPage;
	var qParams = {
		limit: rowsPerPage,
		offset: offset
	};
	if (orderby) {
		qParams["sort"] = orderby;
	}
	if (!isEmpty(filtersSet)) {
		qParams["filter"] = filtersSet;
	}
	return function(dispatch) {
		dispatch({
			type: acts.LOADING
		});
		API.get(`sequences`, {
			params: qParams
		})
			.then(response => {
				dispatch({
					type: acts.LOADED,
					payload: {
						total: response.data.total,
						sequences: response.data.data
					}
				});
			})
			.catch(error => {
				console.log(error);
			});
	};
};
