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
import {
	getHasLoaded,
	getIsLoading,
	getSearchTerm,
	getSearchType,
	getSearchTable,
	getTablePage,
	getCount,
	getTableRows,
	getTableSort,
	getDownloadUrl,
	getDownloadFastaUrl,
} from './search_selectors';

const columns = [
	{ name: 'MatchType', options: { sort: true } },
	{ name: 'seqDbID', options: { display: 'excluded', download: false } },
	{ name: 'SeqName', options: { sort: true } },
	{
		name: 'SeqLength',
		options: {
			display: 'false',
			sort: true,
			customBodyRender: renderNumber,
		},
	},
	{ name: 'SeqGroup', options: { display: 'false', sort: true } },
	{ name: 'SeqSample', options: { display: 'false', sort: true } },
	{ name: 'SeqType', options: { display: 'false', sort: true } },
	{
		name: 'SeqExtLink',
		options: { display: 'false', sort: false, download: false },
	},
	{ name: 'AlignedName', options: { sort: true } },
	{
		name: 'FeatureLength',
		options: {
			sort: false,
			download: false,
			customBodyRender: renderRightText,
		},
	},
	{
		name: 'AlignStart',
		options: {
			display: 'false',
			sort: false,
			customBodyRender: renderNumber,
		},
	},
	{
		name: 'AlignEnd',
		options: {
			display: 'false',
			sort: false,
			customBodyRender: renderNumber,
		},
	},
	{ name: 'AlignStrand', options: { display: 'false', sort: false } },
	{ name: 'Source', options: { sort: false, download: false } },
	{ name: 'AlignSpecies', options: { display: 'false', sort: true } },
	{ name: 'AlignSource', options: { display: 'false', sort: true } },
	{ name: 'AlignMethod', options: { display: 'false', sort: true } },
	{ name: 'AlignScore', options: { display: 'false', sort: false } },
	{ name: 'Annotation', options: { sort: false } },
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
		const clickedSeq = this.props.results[cellMeta.rowIndex];
		if (clickedSeq[10]) {
			this.props.history.push({
				pathname: '/Sequences/' + encodeURIComponent(clickedSeq[2]),
				search:
					'?' +
					encodeURIComponent(clickedSeq[10]) +
					'-' +
					encodeURIComponent(clickedSeq[11]),
			});
		} else {
			this.props.history.push({
				pathname: '/Sequences/' + encodeURIComponent(clickedSeq[2]),
			});
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
	hasloaded: getHasLoaded,
	loading: getIsLoading,
	searchTerm: getSearchTerm,
	searchType: getSearchType,
	results: getSearchTable,
	page: getTablePage,
	total: getCount,
	rowsPerPage: getTableRows,
	orderby: getTableSort,
	dlURL: getDownloadUrl,
	dlFastaURL: getDownloadFastaUrl,
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
