import { createSelector } from 'reselect';

export const getStateSlice = (state) => state.totals;

export const getHasLoaded = (state) => state.totals.loaded;
export const getIsLoading = (state) => state.totals.loading;
export const getError = (state) => state.totals.error;
export const getTotalsObj = (state) => state.totals.totals;

export const getTotalsTable = createSelector(
	getHasLoaded,
	getTotalsObj,
	(loaded, totalObj) => {
		if (loaded) {
			return [
				['Samples', totalObj['sample'].toLocaleString(), '/Samples'],
				[
					'Groups/Assemblies',
					totalObj['seqgroup'].toLocaleString(),
					'/SeqGroups',
				],
				['Sequences', totalObj['sequence'].toLocaleString(), '/Sequences'],
				[
					'Sequence interrelations',
					totalObj['seqrelation'].toLocaleString(),
					null,
				],
				[
					'Alignment-based annotations',
					totalObj['alignedannot'].toLocaleString(),
					null,
				],
				['Gene predictions', totalObj['geneprediction'].toLocaleString(), null],
			];
		} else {
			return [];
		}
	},
);
