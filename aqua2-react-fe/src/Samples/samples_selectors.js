import { createSelector } from "reselect";
import { map, at, reduce } from "lodash";

export const getStateSlice = state => state.samples;

export const getHasLoaded = state => state.samples.loaded;
export const getIsLoading = state => state.samples.loading;
export const getError = state => state.samples.error;
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

/* Return Object with keys == SampleNames and values == idNums */
export const getNamesIDsList = createSelector(getSamplesObj, samplesObj => {
	if (samplesObj.length) {
		return reduce(
			samplesObj,
			function(samplesList, sampleRow) {
				samplesList[sampleRow.name] = sampleRow.id;
				return samplesList;
			},
			{}
		);
	} else {
		return {};
	}
});
