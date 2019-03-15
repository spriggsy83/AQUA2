import { createSelector } from 'reselect';
import { map } from 'lodash';

export const getStateSlice = (state) => state.oneseq.alignments;

export const getHasLoaded = (state) => state.oneseq.alignments.loaded;
export const getIsLoading = (state) => state.oneseq.alignments.loading;
export const getError = (state) => state.oneseq.alignments.error;

export const getSeqID = (state) => state.oneseq.alignments.id;
export const getSeqName = (state) => state.oneseq.alignments.seqName;
export const getSeqLength = (state) => state.oneseq.alignments.seqLength;

export const getSubseqStart = (state) => state.oneseq.alignments.subseqStart;
export const getSubseqEnd = (state) => state.oneseq.alignments.subseqEnd;

export const getCount = (state) => state.oneseq.alignments.total;
export const getAlignmentsObj = (state) => state.oneseq.alignments.alignments;

/* Alignment table params */
export const getTablePage = (state) => state.oneseq.alignments.page;
export const getTableRows = (state) => state.oneseq.alignments.rowsPerPage;
export const getTableSort = (state) => state.oneseq.alignments.orderby;
export const getFilters = (state) => state.oneseq.alignments.filtersSet;

export const getAlignmentsTable = createSelector(
	getAlignmentsObj,
	(alignmentsObj) => {
		if (alignmentsObj.length) {
			return map(alignmentsObj, (alignRow) => {
				// Add combo-coords column
				alignRow.alignCoords =
					alignRow.alignStart.toLocaleString() +
					'-' +
					alignRow.alignEnd.toLocaleString();
				// Update strand display
				if (alignRow.alignStrand === 1) {
					alignRow.alignStrand = '+';
				} else if (alignRow.alignStrand === 0) {
					alignRow.alignStrand = '-';
				}
				// Add feature combo-coords column
				if (alignRow.featureAlignStart && alignRow.seqLength) {
					alignRow.featureAlignCoords =
						alignRow.featureAlignStart.toLocaleString() +
						'-' +
						alignRow.featureAlignEnd.toLocaleString() +
						' / ' +
						alignRow.seqLength.toLocaleString();
				} else {
					alignRow.featureAlignCoords = null;
				}
				// Add combo source column
				if (alignRow.featureType === 'alignedAnnot') {
					alignRow.source =
						alignRow.method +
						' | ' +
						alignRow.featureSource +
						' | ' +
						alignRow.featureSpecies;
				} else {
					alignRow.source = alignRow.method;
				}
				// Add linked cds/prot seqs into annotation column
				if (!alignRow.featureAnnot) {
					if (alignRow.isCdsName && alignRow.isProtName) {
						alignRow.featureAnnot =
							'Has CDS: ' +
							alignRow.isCdsName +
							', Has Protein: ' +
							alignRow.isProtName;
					} else if (alignRow.isCdsName) {
						alignRow.featureAnnot = 'Has CDS: ' + alignRow.isCdsName;
					} else if (alignRow.isProtName) {
						alignRow.featureAnnot = 'Has Protein: ' + alignRow.isProtName;
					}
				}
				return alignRow;
			});
		} else {
			return [];
		}
	},
);
