import React from 'react';
import { createSelector } from 'reselect';
import { map, find } from 'lodash';

export const getStateSlice = (state) => state.search;

export const getSearchTerm = (state) => state.search.searchTerm;
export const getSearchType = (state) => state.search.searchType;

export const getHasLoaded = (state) => state.search.loaded;
export const getIsLoading = (state) => state.search.loading;
export const getError = (state) => state.search.error;
export const getCount = (state) => state.search.total;
export const getSearchResult = (state) => state.search.searchResult;

/* Result table params */
export const getTablePage = (state) => state.search.page;
export const getTableRows = (state) => state.search.rowsPerPage;
export const getTableSort = (state) => state.search.orderby;
export const getDownloadUrl = (state) => state.search.dlUrl;
export const getDownloadFastaUrl = (state) => state.search.dlFastaUrl;

export const getSearchParams = createSelector(
	getTablePage,
	getTableRows,
	getTableSort,
	getSearchType,
	(page, rowsPerPage, orderby, searchType) => {
		var qParams = {
			limit: rowsPerPage,
			offset: page * rowsPerPage,
		};
		if (searchType) {
			qParams['searchtype'] = searchType;
		}
		if (orderby) {
			qParams['sort'] = orderby;
		}
		return qParams;
	},
);

export const getSearchTable = createSelector(
	getSearchResult,
	(searchRes) => {
		if (searchRes.length) {
			return map(searchRes, (resultRow) => {
				// Turn extLink into real link
				resultRow.extLink = (
					<a
						href={resultRow.seqExtLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						{resultRow.seqExtLinkLabel}
					</a>
				);
				// Assemble FeatureLength column
				if (resultRow.resultType === 'sequence') {
					resultRow.featureLength = resultRow.seqLength.toLocaleString();
				} else if (resultRow.resultType === 'alignedannot') {
					resultRow.featureLength =
						resultRow.alignStart.toLocaleString() +
						'-' +
						resultRow.alignEnd.toLocaleString() +
						' / ' +
						resultRow.seqLength.toLocaleString();
				} else {
					resultRow.featureLength = null;
				}
				// Update strand display
				if (resultRow.alignStrand === 1) {
					resultRow.alignStrand = '+';
				} else if (resultRow.alignStrand === 0) {
					resultRow.alignStrand = '-';
				}
				// Assemble Source column
				if (resultRow.resultType === 'sequence') {
					resultRow.source =
						resultRow.seqGroupName + ' | ' + resultRow.seqTypeName;
				} else if (resultRow.resultType === 'alignedannot') {
					resultRow.source =
						resultRow.alignMethod +
						' | ' +
						resultRow.alignSource +
						' | ' +
						resultRow.alignSpecies;
				} else {
					resultRow.source = null;
				}
				// Assemble annotation column
				if (resultRow.resultType === 'sequence') {
					resultRow.annotation = resultRow.seqAnnot;
				} else if (resultRow.resultType === 'alignedannot') {
					resultRow.annotation = resultRow.alignAnnot;
				} else {
					resultRow.annotation = null;
				}
				return resultRow;
			});
		} else {
			return [];
		}
	},
);

const searchObjToSeqObj = (searchRow) => {
	return {
		id: searchRow.seqId,
		name: searchRow.seqName,
		length: searchRow.seqLength,
		groupId: searchRow.seqGroupId,
		groupName: searchRow.seqGroupName,
		sampleId: searchRow.seqSampleId,
		sampleName: searchRow.seqSampleName,
		typeId: searchRow.seqTypeId,
		typeName: searchRow.seqTypeName,
		annotNote: searchRow.seqAnnot,
		extLink: searchRow.seqExtLink,
		extLinkLabel: searchRow.seqExtLinkLabel,
	};
};

export const getSeqByID = (state, seqID) => {
	var searchRow = find(getSearchResult(state), { id: seqID });
	if (searchRow) {
		return searchObjToSeqObj(searchRow);
	} else {
		return undefined;
	}
};

export const getSeqByName = (state, seqName) => {
	var searchRow = find(getSearchResult(state), { name: seqName });
	if (searchRow) {
		return searchObjToSeqObj(searchRow);
	} else {
		return undefined;
	}
};
