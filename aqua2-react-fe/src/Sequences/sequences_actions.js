'use-strict';
import { isEmpty, isArray } from 'lodash';
import * as acts from './sequences_action_list';
import { getIsLoading } from './sequences_selectors';
import API from '../common/API';

export const requestSequences = ({
	page = 0,
	rowsPerPage = 50,
	orderby = null,
	filtersSet = {},
} = {}) => {
	const offset = page * rowsPerPage;
	var qParams = {
		limit: rowsPerPage,
		offset: offset,
	};
	if (orderby) {
		qParams['sort'] = orderby;
	}
	if (!isEmpty(filtersSet)) {
		qParams['filter'] = filtersSet;
	}
	return function(dispatch, getState) {
		if (!getIsLoading(getState())) {
			dispatch({
				type: acts.LOADING,
			});
			API.get(`sequences`, {
				params: qParams,
			})
				.then((response) => {
					if (isArray(response.data.data)) {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: response.data.total,
								sequences: response.data.data,
								page: page,
								rowsPerPage: rowsPerPage,
								orderby: orderby,
								filtersSet: filtersSet,
								error: null,
								dlUrl: response.request.responseURL
									.replace(/sequences/, 'seq-dl')
									.replace(/limit=\d+&offset=\d+/, ''),
								dlFastaUrl: response.request.responseURL
									.replace(/sequences/, 'seq-dl-fasta')
									.replace(/limit=\d+&offset=\d+/, ''),
							},
						});
					} else {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: 0,
								sequences: [],
								page: page,
								rowsPerPage: rowsPerPage,
								orderby: orderby,
								filtersSet: filtersSet,
								error: 'No data found',
								dlUrl: null,
								dlFastaUrl: null,
							},
						});
					}
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
};
