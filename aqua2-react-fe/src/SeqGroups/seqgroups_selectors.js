import { createSelector } from "reselect";
import { map, at } from "lodash";

export const getStateSlice = state => state.seqgroups;

export const getHasLoaded = state => state.seqgroups.loaded;
export const getIsLoading = state => state.seqgroups.loading;
export const getError = state => state.seqgroups.error;
export const getCount = state => state.seqgroups.total;
export const getSeqGroupsObj = state => state.seqgroups.seqgroups;

export const getSeqGroupsTable = createSelector(
	getSeqGroupsObj,
	seqgroupsObj => {
		if (seqgroupsObj.length) {
			return map(seqgroupsObj, seqgroup => {
				return at(seqgroup, [
					"id",
					"name",
					"description",
					"fromsamps",
					"numseqs",
					"avlength",
					"n50length",
					"maxlength"
				]);
			});
		} else {
			return [];
		}
	}
);
