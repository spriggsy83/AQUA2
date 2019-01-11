import React from "react";
import { createSelector } from "reselect";
import { map, at } from "lodash";

export const getStateSlice = state => state.sequences;

export const getStatus = state => state.sequences.loaded;

export const getCount = state => state.sequences.total;

export const getSequencesObj = state => state.sequences.sequences;

export const getSequencesTable = createSelector(
	getSequencesObj,
	sequencesObj => {
		if (sequencesObj.length) {
			return map(sequencesObj, sequence => {
				var seqRow = at(sequence, [
					"id",
					"name",
					"length",
					"groupId",
					"groupName",
					"sampleId",
					"sampleName",
					"typeId",
					"typeName",
					"annotNote"
				]);
				seqRow.push(
					<a
						href={sequence.extLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						{sequence.extLinkLabel}
					</a>
				);
				return seqRow;
			});
		} else {
			return [];
		}
	}
);
