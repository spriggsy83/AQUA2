'use-strict';
import { isEmpty, isArray } from 'lodash';
import * as acts from './alignments_action_list';
import {
	getSeqID,
	getSubseqStart,
	getSubseqEnd,
	getSeqLength,
} from './alignments_selectors';
import API from '../../common/API';

export const requestAlignments = ({
	page = 0,
	rowsPerPage = 50,
	orderby = null,
	filtersSet = {},
	newSubseqStart = null,
	newSubseqEnd = null,
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
		var seqId = getSeqID(getState());
		if (seqId) {
			var subseqStart = newSubseqStart || getSubseqStart(getState());
			var subseqEnd = newSubseqEnd || getSubseqEnd(getState());
			if (!(subseqStart === 1 && subseqEnd === getSeqLength(getState()))) {
				qParams['start'] = subseqStart;
				qParams['end'] = subseqEnd;
			}

			dispatch({
				type: acts.LOADING,
			});
			API.get(`alignments/` + seqId, {
				params: qParams,
			})
				.then((response) => {
					if (isArray(response.data.data)) {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: response.data.total,
								alignments: response.data.data,
								page: page,
								rowsPerPage: rowsPerPage,
								orderby: orderby,
								filtersSet: filtersSet,
								error: null,
								subseqStart: subseqStart,
								subseqEnd: subseqEnd,
							},
						});
					} else {
						dispatch({
							type: acts.LOADED,
							payload: {
								total: 0,
								alignments: [],
								page: page,
								rowsPerPage: rowsPerPage,
								orderby: orderby,
								filtersSet: filtersSet,
								error: 'No data found',
								subseqStart: subseqStart,
								subseqEnd: subseqEnd,
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
