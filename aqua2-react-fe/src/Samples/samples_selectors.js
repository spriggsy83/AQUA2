import { createSelector } from "reselect";
import { map, at } from "lodash";

export const getStateSlice = state => state.samples;

export const getStatus = state => state.samples.loaded;

export const getCount = state => state.samples.total;

export const getSamplesObj = state => state.samples.samples;

export const getSamplesTable = createSelector(getSamplesObj, samplesObj => {
	if (samplesObj.length) {
		return map(samplesObj, sample => {
			return at(sample, [
				"id",
				"name",
				"species",
				"description",
				"ingroups",
				"numseqs"
			]);
		});
	} else {
		return [];
	}
});
