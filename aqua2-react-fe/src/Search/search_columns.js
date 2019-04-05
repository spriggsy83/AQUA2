import { createSelectorCreator, defaultMemoize } from 'reselect';
import { isEqual } from 'lodash';
import { renderNumber, renderRightText } from '../common/renderHelpers';

// Define selector that uses isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const getColViewSettings = (state) => state.search.columnView;

export const getSearchColumns = createDeepEqualSelector(
	getColViewSettings,
	(columnView) => {
		return [
			{
				name: 'resultType',
				label: 'Match type',
				options: {
					display: columnView.resultType,
					sort: true,
				},
			},
			{
				name: 'seqId',
				label: 'seqDbID',
				options: {
					display: columnView.seqId,
				},
			},
			{
				name: 'seqName',
				label: 'Sequence',
				options: {
					display: columnView.seqName,
					sort: true,
				},
			},
			{
				name: 'seqLength',
				label: 'Seq length',
				options: {
					display: columnView.seqLength,
					sort: true,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'seqGroupName',
				label: 'Seq group',
				options: {
					display: columnView.seqGroupName,
					sort: true,
				},
			},
			{
				name: 'seqSampleName',
				label: 'Seq sample',
				options: {
					display: columnView.seqSampleName,
					sort: true,
				},
			},
			{
				name: 'seqTypeName',
				label: 'Seq type',
				options: {
					display: columnView.seqTypeName,
					sort: true,
				},
			},
			{
				name: 'extLink',
				label: 'External link',
				options: {
					display: columnView.extLink,
					sort: false,
				},
			},
			{
				name: 'alignName',
				label: 'Name of aligned',
				options: {
					display: columnView.alignName,
					sort: true,
				},
			},
			{
				name: 'featureLength',
				label: 'Feature length',
				options: {
					display: columnView.featureLength,
					sort: false,
					customBodyRender: renderRightText,
				},
			},
			{
				name: 'alignStart',
				label: 'Align start coord',
				options: {
					display: columnView.alignStart,
					sort: false,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'alignEnd',
				label: 'Align end coord',
				options: {
					display: columnView.alignEnd,
					sort: false,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'alignStrand',
				label: 'Strand',
				options: {
					display: columnView.alignStrand,
					sort: false,
				},
			},
			{
				name: 'source',
				label: 'Feature source',
				options: {
					display: columnView.source,
					sort: false,
				},
			},
			{
				name: 'alignSpecies',
				label: 'Species',
				options: {
					display: columnView.alignSpecies,
					sort: true,
				},
			},
			{
				name: 'alignSource',
				label: 'Align source',
				options: {
					display: columnView.alignSource,
					sort: true,
				},
			},
			{
				name: 'alignMethod',
				label: 'Align method',
				options: {
					display: columnView.alignMethod,
					sort: true,
				},
			},
			{
				name: 'alignScore',
				label: 'Align score',
				options: {
					display: columnView.alignScore,
					sort: false,
				},
			},
			{
				name: 'annotation',
				label: 'Annotation',
				options: {
					display: columnView.annotation,
					sort: false,
				},
			},
		];
	},
);
