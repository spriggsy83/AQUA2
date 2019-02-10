import { createSelector } from "reselect";

export const getStateSlice = state => state.oneseq.seqdetail;

export const getHasLoaded = state => state.oneseq.seqdetail.loaded;
export const getIsLoading = state => state.oneseq.seqdetail.loading;
export const getError = state => state.oneseq.seqdetail.error;

export const getSeqID = state => state.oneseq.seqdetail.id;
export const getSeqName = state => state.oneseq.seqdetail.name;
export const getSeqDetail = state => state.oneseq.seqdetail.seqDetail;
export const getSubseqStart = state => state.oneseq.seqdetail.subseqStart;
export const getSubseqEnd = state => state.oneseq.seqdetail.subseqEnd;

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
