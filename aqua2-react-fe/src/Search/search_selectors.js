import React from "react";
import { createSelector } from "reselect";
import { map, at, find } from "lodash";

export const getStateSlice = state => state.search;

export const getSearchTerm = state => state.search.searchTerm;
export const getSearchType = state => state.search.searchType;

export const getHasLoaded = state => state.search.loaded;
export const getIsLoading = state => state.search.loading;
export const getError = state => state.search.error;
export const getCount = state => state.search.total;
export const getSearchResult = state => state.search.searchResult;

/* Result table params */
export const getTablePage = state => state.search.page;
export const getTableRows = state => state.search.rowsPerPage;
export const getTableSort = state => state.search.orderby;

export const getSearchParams = createSelector(
	getTablePage,
	getTableRows,
	getTableSort,
	getSearchType,
	(page, rowsPerPage, orderby, searchType) => {
		var qParams = {
			limit: rowsPerPage,
			offset: page * rowsPerPage
		};
		if (searchType) {
			qParams["searchtype"] = searchType;
		}
		if (orderby) {
			qParams["sort"] = orderby;
		}
		return qParams;
	}
);

export const getSearchTable = createSelector(getSearchResult, searchRes => {
	if (searchRes.length) {
		return map(searchRes, resultRow => {
			var tableRow = at(resultRow, [
				"resultType",
				"seqId",
				"seqName",
				"seqLength",
				"seqGroupName",
				"seqSampleName",
				"seqTypeName"
			]);
			tableRow.push(
				<a
					href={resultRow.extLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					{resultRow.extLinkLabel}
				</a>
			);

			tableRow.push(resultRow.alignName);

			if (resultRow.resultType === "sequence") {
				tableRow.push(resultRow.seqLength.toLocaleString());
			} else if (resultRow.resultType === "alignedannot") {
				tableRow.push(
					resultRow.alignStart.toLocaleString() +
						"-" +
						resultRow.alignEnd.toLocaleString() +
						" / " +
						resultRow.seqLength.toLocaleString()
				);
			} else {
				tableRow.push(null);
			}

			tableRow.push(resultRow.alignStart);
			tableRow.push(resultRow.alignEnd);
			if (resultRow.alignStrand === 1) {
				tableRow.push("+");
			} else if (resultRow.alignStrand === 0) {
				tableRow.push("-");
			} else {
				tableRow.push(null);
			}

			if (resultRow.resultType === "sequence") {
				tableRow.push(
					resultRow.seqGroupName + " | " + resultRow.seqTypeName
				);
			} else if (resultRow.resultType === "alignedannot") {
				tableRow.push(
					resultRow.alignMethod +
						" | " +
						resultRow.alignSource +
						" | " +
						resultRow.alignSpecies
				);
			} else {
				tableRow.push(null);
			}
			tableRow.push(
				...at(resultRow, [
					"alignSpecies",
					"alignSource",
					"alignMethod",
					"alignScore"
				])
			);
			if (resultRow.resultType === "sequence") {
				tableRow.push(resultRow.seqAnnot);
			} else if (resultRow.resultType === "alignedannot") {
				tableRow.push(resultRow.alignAnnot);
			} else {
				tableRow.push(null);
			}
			return tableRow;
		});
	} else {
		return [];
	}
});

const searchObjToSeqObj = searchRow => {
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
		extLinkLabel: searchRow.seqExtLinkLabel
	};
};

export const getSeqByID = seqID => {
	return createSelector(getSearchResult, searchRes => {
		var searchRow = find(searchRes, { id: seqID });
		if (searchRow) {
			return searchObjToSeqObj(searchRow);
		} else {
			return undefined;
		}
	});
};

export const getSeqByName = seqName => {
	return createSelector(getSearchResult, searchRes => {
		var searchRow = find(searchRes, { name: seqName });
		if (searchRow) {
			return searchObjToSeqObj(searchRow);
		} else {
			return undefined;
		}
	});
};
