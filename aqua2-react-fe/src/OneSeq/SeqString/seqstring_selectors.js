import { createSelector } from "reselect";

export const getStateSlice = state => state.oneseq.seqstring;

export const getHasLoaded = state => state.oneseq.seqstring.loaded;
export const getIsLoading = state => state.oneseq.seqstring.loading;
export const getError = state => state.oneseq.seqstring.error;

export const getSeqID = state => state.oneseq.seqstring.id;
export const getSeqName = state => state.oneseq.seqstring.seqName;
export const getSeqLength = state => state.oneseq.seqstring.seqLength;
export const getSeqType = state => state.oneseq.seqstring.seqType;
export const getSeqString = state => state.oneseq.seqstring.seqStr;

export const getSubseqHasLoaded = state => state.oneseq.seqstring.subLoaded;
export const getSubseqIsLoading = state => state.oneseq.seqstring.subLoading;
export const getSubseqError = state => state.oneseq.seqstring.subError;

export const getSubseqString = state => state.oneseq.seqstring.subseqStr;
export const getSubseqStart = state => state.oneseq.seqstring.subseqStart;
export const getSubseqEnd = state => state.oneseq.seqstring.subseqEnd;

export const getSubseqFromSeq = (state, start, end) => {
	if (getSeqString(state)) {
		return getSeqString(state).substring(start - 1, end);
	}
	return null;
};

export const getFormattedSeqstr = createSelector(
	getHasLoaded,
	getSeqString,
	getSeqName,
	(loaded, seqStr, seqName) => {
		if (loaded && seqStr) {
			return ">" + seqName + " \n" + seqStr.replace(/(\w{100})/g, "$1 \n");
		} else {
			return null;
		}
	}
);

export const getFormattedSubseqStr = createSelector(
	getSubseqHasLoaded,
	getSubseqString,
	getSeqName,
	getSubseqStart,
	getSubseqEnd,
	(loaded, seqStr, seqName, start, end) => {
		if (loaded && seqStr) {
			return (
				">" +
				seqName +
				" subseq:" +
				start +
				"-" +
				end +
				" \n" +
				seqStr.replace(/(\w{100})/g, "$1 \n")
			);
		} else {
			return null;
		}
	}
);

const complements = {
	A: "T",
	T: "A",
	C: "G",
	G: "C",
	R: "Y",
	Y: "R",
	M: "K",
	K: "M",
	S: "S",
	W: "W",
	B: "V",
	D: "H",
	H: "D",
	V: "B",
	N: "N"
};

export const getFormattedRevComp = createSelector(
	getHasLoaded,
	getSeqString,
	getSeqName,
	(loaded, seqStr, seqName) => {
		if (loaded && seqStr) {
			var newSeqStr = "";
			for (var i = seqStr.length - 1; i >= 0; i--) {
				if (complements.hasOwnProperty(seqStr[i])) {
					newSeqStr += complements[seqStr[i]];
				} else {
					return null;
				}
			}
			return (
				">" + seqName + " RevComp \n" + newSeqStr.replace(/(\w{100})/g, "$1 \n")
			);
		} else {
			return null;
		}
	}
);

export const getFormattedRevCompSubseq = createSelector(
	getSubseqHasLoaded,
	getSubseqString,
	getSeqName,
	getSubseqStart,
	getSubseqEnd,
	(loaded, seqStr, seqName, start, end) => {
		if (loaded && seqStr) {
			var newSeqStr = "";
			for (var i = seqStr.length - 1; i >= 0; i--) {
				if (complements.hasOwnProperty(seqStr[i])) {
					newSeqStr += complements[seqStr[i]];
				} else {
					return null;
				}
			}
			return (
				">" +
				seqName +
				" subseq:" +
				start +
				"-" +
				end +
				" RevComp \n" +
				newSeqStr.replace(/(\w{100})/g, "$1 \n")
			);
		} else {
			return null;
		}
	}
);
