import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import MuiDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import FastaIcon from '@material-ui/icons/ArrowForwardIos';
import Tooltip from '@material-ui/core/Tooltip';
import {
	renderNumber,
	renderRightText,
	renderLoadingBars,
} from '../common/renderHelpers';
import { createStructuredSelector } from 'reselect';
import { requestSearch } from './search_actions';
import * as selectors from './search_selectors';

const columns = [
	{
		name: 'resultType',
		label: 'Match type',
		options: { display: 'true', sort: true },
	},
	{ name: 'seqId', label: 'seqDbID', options: { display: 'excluded' } },
	{
		name: 'seqName',
		label: 'Sequence',
		options: { display: 'true', sort: true },
	},
	{
		name: 'seqLength',
		label: 'Seq length',
		options: {
			display: 'false',
			sort: true,
			customBodyRender: renderNumber,
		},
	},
	{
		name: 'seqGroupName',
		label: 'Seq group',
		options: { display: 'false', sort: true },
	},
	{
		name: 'seqSampleName',
		label: 'Seq sample',
		options: { display: 'false', sort: true },
	},
	{
		name: 'seqTypeName',
		label: 'Seq type',
		options: { display: 'false', sort: true },
	},
	{
		name: 'extLink',
		label: 'External link',
		options: { display: 'false', sort: false },
	},
	{
		name: 'alignName',
		label: 'Name of aligned',
		options: { display: 'true', sort: true },
	},
	{
		name: 'featureLength',
		label: 'Feature length',
		options: {
			display: 'true',
			sort: false,
			customBodyRender: renderRightText,
		},
	},
	{
		name: 'alignStart',
		label: 'Align start coord',
		options: {
			display: 'false',
			sort: false,
			customBodyRender: renderNumber,
		},
	},
	{
		name: 'alignEnd',
		label: 'Align end coord',
		options: {
			display: 'false',
			sort: false,
			customBodyRender: renderNumber,
		},
	},
	{
		name: 'alignStrand',
		label: 'Strand',
		options: { display: 'false', sort: false },
	},
	{
		name: 'source',
		label: 'Feature source',
		options: { display: 'true', sort: false },
	},
	{
		name: 'alignSpecies',
		label: 'Species',
		options: { display: 'false', sort: true },
	},
	{
		name: 'alignSource',
		label: 'Align source',
		options: { display: 'false', sort: true },
	},
	{
		name: 'alignMethod',
		label: 'Align method',
		options: { display: 'false', sort: true },
	},
	{
		name: 'alignScore',
		label: 'Align score',
		options: { display: 'false', sort: false },
	},
	{
		name: 'annotation',
		label: 'Annotation',
		options: { display: 'true', sort: false },
	},
];

class SearchResultList extends Component {
	getData = ({ newPage, newRowsPerPage, newOrderby } = {}) => {
		const { searchTerm, searchType, page, rowsPerPage, orderby } = this.props;
		this.props.requestSearch({
			searchTerm: searchTerm,
			searchType: searchType,
			page: newPage !== undefined ? newPage : page,
			rowsPerPage: newRowsPerPage !== undefined ? newRowsPerPage : rowsPerPage,
			orderby: newOrderby !== undefined ? newOrderby : orderby,
		});
	};

	/** Table sort changed **/
	onColumnSortChange = (changedColumn, direction) => {
		var col = changedColumn
			.replace('MatchType', 'resultType')
			.replace('SeqName', 'seqName')
			.replace('SeqLength', 'seqLength')
			.replace('SeqGroup', 'seqGroupName')
			.replace('SeqSample', 'seqSampleName')
			.replace('SeqType', 'seqTypeName')
			.replace('AlignedName', 'alignName')
			.replace('AlignSpecies', 'alignSpecies')
			.replace('AlignSource', 'alignSource')
			.replace('AlignMethod', 'alignMethod');
		var dir = direction.replace(/(asc|desc)ending/, '$1');
		this.getData({ newPage: 0, newOrderby: `${col} ${dir}` });
	};

	/** Table page changed **/
	onTableChange = (action, tableState) => {
		const { page, rowsPerPage } = this.props;
		const newPage = tableState.page;
		const newRowsPerPage = tableState.rowsPerPage;
		if (newPage !== page || newRowsPerPage !== rowsPerPage) {
			this.getData({ newPage: newPage, newRowsPerPage: newRowsPerPage });
		}
	};

	onCellClick = (colData, cellMeta) => {
		// If NOT external link column clicked
		if (cellMeta.colIndex !== 7) {
			const clicked = this.props.results[cellMeta.rowIndex];
			/* If a valid ref seq row clicked */
			if (clicked.seqName) {
				if (clicked.alignStart && clicked.alignEnd) {
					this.props.history.push({
						pathname: '/Sequences/' + encodeURIComponent(clicked.seqName),
						search:
							'?' +
							encodeURIComponent(clicked.alignStart) +
							'-' +
							encodeURIComponent(clicked.alignEnd),
					});
				} else {
					this.props.history.push({
						pathname: '/Sequences/' + encodeURIComponent(clicked.seqName),
					});
				}
			}
		}
	};

	renderCustomToolbar = () => {
		const { dlURL, dlFastaURL, total } = this.props;
		if (total < 500000) {
			return (
				<>
					<Tooltip id="download-button" title="Download CSV">
						<IconButton
							aria-label="Download CSV"
							onClick={() => {
								window.open(dlURL, '_blank');
							}}
						>
							<DownloadIcon />
						</IconButton>
					</Tooltip>
					<Tooltip id="download-fasta-button" title="Download FASTA">
						<IconButton
							aria-label="Download FASTA"
							onClick={() => {
								window.open(dlFastaURL, '_blank');
							}}
						>
							<FastaIcon />
						</IconButton>
					</Tooltip>
				</>
			);
		} else {
			return null;
		}
	};

	/** options Object required by mui-datatable **/
	getTableOptions = () => {
		const { page, total, rowsPerPage } = this.props;
		return {
			pagination: true,
			viewColumns: true,
			selectableRows: false,
			search: false,
			filter: false,
			print: false,
			download: false,
			rowsPerPageOptions: [50, 100, 200, 1000],
			rowsPerPage: rowsPerPage,
			page: page,
			count: total,
			serverSide: true,
			onTableChange: this.onTableChange,
			onColumnSortChange: this.onColumnSortChange,
			onCellClick: this.onCellClick,
			customToolbar: this.renderCustomToolbar,
		};
	};

	render() {
		const { results, loading, hasloaded, searchTerm } = this.props;
		return (
			<>
				{loading && renderLoadingBars()}
				<>
					{hasloaded && (
						<MuiDataTable
							data={results}
							columns={columns}
							options={this.getTableOptions()}
							title={'Searched: "' + searchTerm + '"'}
						/>
					)}
				</>
				{loading && renderLoadingBars()}
			</>
		);
	}
}

/**
 * allows us to call our application state from props
 */
const mapStateToProps = createStructuredSelector({
	hasloaded: selectors.getHasLoaded,
	loading: selectors.getIsLoading,
	searchTerm: selectors.getSearchTerm,
	searchType: selectors.getSearchType,
	results: selectors.getSearchTable,
	page: selectors.getTablePage,
	total: selectors.getCount,
	rowsPerPage: selectors.getTableRows,
	orderby: selectors.getTableSort,
	dlURL: selectors.getDownloadUrl,
	dlFastaURL: selectors.getDownloadFastaUrl,
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ requestSearch },
	),
)(SearchResultList);
