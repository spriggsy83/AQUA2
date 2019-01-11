import { createSelector } from "reselect";
import { map, at } from "lodash";

export const getStateSlice = state => state.seqgroups;

export const getStatus = state => state.seqgroups.loaded;

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
