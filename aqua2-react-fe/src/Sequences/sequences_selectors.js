import React from "react";
import { createSelector } from "reselect";
import { map, at, find } from "lodash";

export const getStateSlice = state => state.sequences;

export const getHasLoaded = state => state.sequences.loaded;
export const getIsLoading = state => state.sequences.loading;
export const getError = state => state.sequences.error;
export const getCount = state => state.sequences.total;
export const getSequencesObj = state => state.sequences.sequences;

/* Sequence table params */
export const getTablePage = state => state.sequences.page;
export const getTableRows = state => state.sequences.rowsPerPage;
export const getTableSort = state => state.sequences.orderby;
export const getFilters = state => state.sequences.filtersSet;

export const getSequencesTable = createSelector(
	getSequencesObj,
	sequencesObj => {
		if (sequencesObj.length) {
			return map(sequencesObj, sequence => {
				var seqRow = at(sequence, [
					"id",
					"name",
					"length",
					"groupId",
					"groupName",
					"sampleId",
					"sampleName",
					"typeId",
					"typeName",
					"annotNote"
				]);
				seqRow.push(
					<a
						href={sequence.extLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						{sequence.extLinkLabel}
					</a>
				);
				return seqRow;
			});
		} else {
			return [];
		}
	}
);

export const getSeqByID = seqID => {
	return createSelector(getSequencesObj, sequencesObj => {
		return find(sequencesObj, { id: seqID });
	});
};

export const getSeqByName = seqName => {
	return createSelector(getSequencesObj, sequencesObj => {
		return find(sequencesObj, { name: seqName });
	});
};
