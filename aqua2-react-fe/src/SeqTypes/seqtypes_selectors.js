import { createSelector } from "reselect";
import { map, at, reduce } from "lodash";

export const getStateSlice = state => state.seqtypes;

export const getHasLoaded = state => state.seqtypes.loaded;
export const getIsLoading = state => state.seqtypes.loading;
export const getError = state => state.seqtypes.error;
export const getCount = state => state.seqtypes.total;
export const getSeqTypesObj = state => state.seqtypes.seqtypes;

export const getSeqTypesTable = createSelector(getSeqTypesObj, seqtypesObj => {
	if (seqtypesObj.length) {
		return map(seqtypesObj, seqtype => {
			return at(seqtype, ["id", "type", "numseqs"]);
		});
	} else {
		return [];
	}
});

/* Return Object with keys == SeqTypeNames and values == idNums */
export const getNamesIDsList = createSelector(getSeqTypesObj, seqtypesObj => {
	if (seqtypesObj.length) {
		return reduce(
			seqtypesObj,
			function(seqtypesList, seqtypeRow) {
				seqtypesList[seqtypeRow.type] = seqtypeRow.id;
				return seqtypesList;
			},
			{}
		);
	} else {
		return {};
	}
});
