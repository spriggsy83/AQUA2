import { createSelector } from "reselect";

export const getStateSlice = state => state.totals;

export const getStatus = state => state.totals.loaded;

export const getTotalsObj = state => state.totals.totals;

export const getTotalsTable = createSelector(
	getStatus,
	getTotalsObj,
	(loaded, totalObj) => {
		if (loaded) {
			return [
				["Samples", totalObj["sample"].toLocaleString(), "/Samples"],
				[
					"Groups/Assemblies",
					totalObj["seqgroup"].toLocaleString(),
					"/SeqGroups"
				],
				[
					"Sequences",
					totalObj["sequence"].toLocaleString(),
					"/Sequences"
				],
				[
					"Sequence interrelations",
					totalObj["seqrelation"].toLocaleString(),
					"/"
				],
				[
					"Alignment-based annotations",
					totalObj["alignedannot"].toLocaleString(),
					"/"
				],
				[
					"Gene predictions",
					totalObj["geneprediction"].toLocaleString(),
					"/"
				]
			];
		} else {
			return [];
		}
	}
);
