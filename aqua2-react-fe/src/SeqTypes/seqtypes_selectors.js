import { createSelector } from "reselect";
import { map, at } from "lodash";

export const getStateSlice = state => state.seqtypes;

export const getStatus = state => state.seqtypes.loaded;

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
