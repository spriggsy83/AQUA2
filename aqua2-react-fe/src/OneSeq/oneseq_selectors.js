import { createSelector } from "reselect";

export const getStateSlice = state => state.oneseq;

export const getHasLoaded = state => state.oneseq.loaded;
export const getIsLoading = state => state.oneseq.loading;
export const getError = state => state.oneseq.error;

export const getSeqID = state => state.oneseq.id;
export const getSeqName = state => state.oneseq.name;
export const getSeqDetail = state => state.oneseq.seqDetail;
export const getSubseqStart = state => state.oneseq.subseqStart;
export const getSubseqEnd = state => state.oneseq.subseqEnd;

export const getSeqDetailTable = createSelector(
	getHasLoaded,
	getSeqDetail,
	(loaded, seqDetail) => {
		if (loaded && seqDetail) {
			return [
				["Name", seqDetail.name, null],
				["Length", seqDetail["length"].toLocaleString(), null],
				[
					"Group/Assembly",
					seqDetail.groupName,
					"/SeqGroups/" + seqDetail.groupName
				],
				["Sample", seqDetail.sampleName, "/Samples/" + seqDetail.sampleName],
				["Type", seqDetail.typeName, "/SeqTypes/" + seqDetail.typeName],
				["External link", seqDetail.extLinkLabel, seqDetail.extLink],
				["Annotation/note", seqDetail.annotNote, null]
			];
		} else {
			return [];
		}
	}
);
