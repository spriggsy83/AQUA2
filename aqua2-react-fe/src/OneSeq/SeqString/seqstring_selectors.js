//import { createSelector } from "reselect";

export const getStateSlice = state => state.oneseq.seqstring;

export const getHasLoaded = state => state.oneseq.seqstring.loaded;
export const getIsLoading = state => state.oneseq.seqstring.loading;
export const getError = state => state.oneseq.seqstring.error;

export const getSeqID = state => state.oneseq.seqstring.id;
export const getSeqString = state => state.oneseq.seqstring.seqStr;

export const getSubseqHasLoaded = state => state.oneseq.seqstring.subLoaded;
export const getSubseqIsLoading = state => state.oneseq.seqstring.subLoading;
export const getSubseqError = state => state.oneseq.seqstring.subError;

export const getSubseqString = state => state.oneseq.seqstring.subseqStr;
export const getSubseqStart = state => state.oneseq.seqstring.subseqStart;
export const getSubseqEnd = state => state.oneseq.seqstring.subseqEnd;

export const getSubseqFromSeq = (state, start, end) => {
	if (getSeqString) {
		return getSeqString.substring(start - 1, end - 1);
	}
	return null;
};
