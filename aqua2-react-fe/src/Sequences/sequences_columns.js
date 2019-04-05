import { createSelectorCreator, defaultMemoize } from 'reselect';
import { isEqual } from 'lodash';
import { renderNumber } from '../common/renderHelpers';

// Define selector that uses isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const getColViewSettings = (state) => state.sequences.columnView;

export const getSequencesColumns = createDeepEqualSelector(
	getColViewSettings,
	(columnView) => {
		return [
			{
				name: 'id',
				label: 'dbID',
				options: {
					display: columnView.id,
					sort: false,
				},
			},
			{
				name: 'name',
				label: 'Name',
				options: {
					display: columnView.name,
					sort: true,
				},
			},
			{
				name: 'length',
				label: 'Length (bp)',
				options: {
					display: columnView.length,
					sort: true,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'groupId',
				label: 'groupId',
				options: {
					display: columnView.groupId,
					sort: false,
				},
			},
			{
				name: 'groupName',
				label: 'Group',
				options: {
					display: columnView.groupName,
					sort: true,
				},
			},
			{
				name: 'sampleId',
				label: 'sampleId',
				options: {
					display: columnView.sampleId,
					sort: false,
				},
			},
			{
				name: 'sampleName',
				label: 'Sample',
				options: {
					display: columnView.sampleName,
					sort: true,
				},
			},
			{
				name: 'typeId',
				label: 'typeId',
				options: {
					display: columnView.typeId,
					sort: false,
				},
			},
			{
				name: 'typeName',
				label: 'Type',
				options: {
					display: columnView.typeName,
					sort: true,
				},
			},
			{
				name: 'annotNote',
				label: 'Annotation note',
				options: {
					display: columnView.annotNote,
					sort: false,
				},
			},
			{
				name: 'extLinkAhref',
				label: 'External link',
				options: {
					display: columnView.extLinkAhref,
					sort: false,
				},
			},
			{
				name: 'extLink',
				label: 'extLink',
				options: {
					display: columnView.extLink,
					sort: false,
				},
			},
			{
				name: 'extLinkLabel',
				label: 'extLinkLabel',
				options: {
					display: columnView.extLinkLabel,
					sort: false,
				},
			},
		];
	},
);
