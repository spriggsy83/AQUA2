import React from 'react';
import { Link } from 'react-router-dom';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { isEqual } from 'lodash';
import { renderNumber } from '../../common/renderHelpers';

// Define selector that uses isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const getColViewSettings = (state) => state.oneseq.alignments.columnView;

function renderAnnotsCol(colvalue) {
	var valueTest = /^Has CDS: (\S+), Has Protein: (\S+)$/i.exec(colvalue);
	if (valueTest) {
		return (
			<>
				{'Has CDS: '}
				<Link to={'/sequences/' + valueTest[1]}>{valueTest[1]}</Link>
				{', Has Protein: '}
				<Link to={'/sequences/' + valueTest[2]}>{valueTest[2]}</Link>
			</>
		);
	}
	valueTest = /^Has (CDS|Protein): (\S+)$/i.exec(colvalue);
	if (valueTest) {
		return (
			<>
				Has {valueTest[1]}:&nbsp;
				<Link to={'/sequences/' + valueTest[2]}>{valueTest[2]}</Link>
			</>
		);
	}
	return <>{colvalue}</>;
}

export const getAlignmentsColumns = createDeepEqualSelector(
	getColViewSettings,
	(columnView) => {
		return [
			{
				name: 'featureType',
				label: 'Type',
				options: {
					display: columnView.featureType,
					sort: true,
				},
			},
			{
				name: 'featureId',
				options: {
					display: columnView.featureId,
					sort: false,
				},
			},
			{
				name: 'featureName',
				label: 'Feature name',
				options: {
					display: columnView.featureName,
					sort: true,
				},
			},
			{
				name: 'seqLength',
				label: 'Length of aligned seq',
				options: {
					display: columnView.seqLength,
					sort: true,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'seqGroupName',
				label: 'Group of aligned seq',
				options: {
					display: columnView.seqGroupName,
					sort: true,
				},
			},
			{
				name: 'seqSampleName',
				label: 'Sample of aligned seq',
				options: {
					display: columnView.seqSampleName,
					sort: true,
				},
			},
			{
				name: 'seqTypeName',
				label: 'Type of aligned seq',
				options: {
					display: columnView.seqTypeName,
					sort: true,
				},
			},
			{
				name: 'alignStart',
				label: 'Start',
				options: {
					display: columnView.alignStart,
					sort: true,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'alignEnd',
				label: 'End',
				options: {
					display: columnView.alignEnd,
					sort: true,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'alignCoords',
				label: 'Align Coords',
				options: {
					display: columnView.alignCoords,
					sort: false,
				},
			},
			{
				name: 'alignStrand',
				label: 'Strand',
				options: {
					display: columnView.alignStrand,
					sort: true,
				},
			},
			{
				name: 'featureAlignStart',
				label: 'Start on aligned seq',
				options: {
					display: columnView.featureAlignStart,
					sort: false,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'featureAlignEnd',
				label: 'End on aligned seq',
				options: {
					display: columnView.featureAlignEnd,
					sort: false,
					customBodyRender: renderNumber,
				},
			},
			{
				name: 'featureAlignCoords',
				label: 'Coords on aligned seq',
				options: {
					display: columnView.featureAlignCoords,
					sort: false,
				},
			},
			{
				name: 'source',
				label: 'Source',
				options: {
					display: columnView.source,
					sort: false,
				},
			},
			{
				name: 'featureSpecies',
				label: 'Species',
				options: {
					display: columnView.featureSpecies,
					sort: true,
				},
			},
			{
				name: 'featureSource',
				label: 'Data source',
				options: {
					display: columnView.featureSource,
					sort: true,
				},
			},
			{
				name: 'method',
				label: 'Method',
				options: {
					display: columnView.method,
					sort: true,
				},
			},
			{
				name: 'score',
				label: 'Score',
				options: {
					display: columnView.score,
					sort: false,
				},
			},
			{
				name: 'featureAnnot',
				label: 'Annotation',
				options: {
					display: columnView.featureAnnot,
					sort: false,
					customBodyRender: renderAnnotsCol,
				},
			},
			{
				name: 'isCdsName',
				label: 'CDS seq name',
				options: {
					display: columnView.isCdsName,
					sort: false,
				},
			},
			{
				name: 'isProtName',
				label: 'Protein seq name',
				options: {
					display: columnView.isProtName,
					sort: false,
				},
			},
			{
				name: 'subParts',
				label: 'Sub-parts',
				options: {
					display: columnView.subParts,
					sort: true,
					customBodyRender: renderNumber,
				},
			},
		];
	},
);
