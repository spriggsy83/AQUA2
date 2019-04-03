import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import FastaIcon from '@material-ui/icons/ArrowForwardIos';
import Tooltip from '@material-ui/core/Tooltip';
import MuiDataTable from 'mui-datatables';
import { renderNumber, renderLoadingBars } from '../common/renderHelpers';
import SeqFilterBar from './components/SeqFilterBar';
import { createStructuredSelector } from 'reselect';
import { requestSequences } from './sequences_actions';
import * as selectors from './sequences_selectors';

const columns = [
	{ name: 'id', label: 'dbID', options: { display: 'false' } },
	{ name: 'name', label: 'Name', options: { display: 'true', sort: true } },
	{
		name: 'length',
		label: 'Length (bp)',
		options: {
			display: 'true',
			sort: true,
			customBodyRender: renderNumber,
		},
	},
	{ name: 'groupId', label: 'groupId', options: { display: 'excluded' } },
	{
		name: 'groupName',
		label: 'Group',
		options: { display: 'true', sort: true },
	},
	{ name: 'sampleId', label: 'sampleId', options: { display: 'excluded' } },
	{
		name: 'sampleName',
		label: 'Sample',
		options: { display: 'true', sort: true },
	},
	{ name: 'typeId', label: 'typeId', options: { display: 'excluded' } },
	{ name: 'typeName', label: 'Type', options: { display: 'true', sort: true } },
	{
		name: 'annotNote',
		label: 'Annotation note',
		options: { display: 'true', sort: false },
	},
	{
		name: 'extLinkAhref',
		label: 'External link',
		options: { display: 'true', sort: false },
	},
	{ name: 'extLink', label: 'extLink', options: { display: 'excluded' } },
	{
		name: 'extLinkLabel',
		label: 'extLinkLabel',
		options: { display: 'excluded' },
	},
];

class ListSequences extends Component {
	state = {
		isFilterShowing: false,
	};

	componentDidMount() {
		if (!this.props.hasloaded) {
			// Get initial data
			this.getData();
		}
	}

	getData = ({ newPage, newRowsPerPage, newOrderby, newFiltersSet } = {}) => {
		const { page, rowsPerPage, orderby, filtersSet } = this.props;
		this.props.requestSequences({
			page: newPage !== undefined ? newPage : page,
			rowsPerPage: newRowsPerPage !== undefined ? newRowsPerPage : rowsPerPage,
			orderby: newOrderby !== undefined ? newOrderby : orderby,
			filtersSet: newFiltersSet !== undefined ? newFiltersSet : filtersSet,
		});
	};

	/** SeqFilterBar submitting new filter list **/
	onFilterSubmit = (newFiltersSet) => {
		this.getData({ newPage: 0, newFiltersSet: newFiltersSet });
	};

	/** Show/hide SeqFilterBar **/
	onFilterHiderClick = () => {
		this.setState((prevState) => ({
			isFilterShowing: !prevState.isFilterShowing,
		}));
	};

	/** SeqFilterBar contains checkbox filter controls **/
	renderFilterToolbar = () => {
		const { isFilterShowing } = this.state;
		const { dlURL, dlFastaURL, total } = this.props;
		let showDownload = total < 500000 ? true : false;
		return (
			<>
				<Tooltip id="filter-button" title="Filter">
					<IconButton aria-label="Filter" onClick={this.onFilterHiderClick}>
						<FilterListIcon />
					</IconButton>
				</Tooltip>
				{showDownload && (
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
				)}
				{isFilterShowing && (
					<SeqFilterBar
						filtersSet={this.props.filtersSet}
						onFilterSubmit={this.onFilterSubmit}
					/>
				)}
			</>
		);
	};

	/** Table sort changed **/
	onColumnSortChange = (col, direction) => {
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
		/* If NOT ExtLink column clicked */
		if (cellMeta.colIndex !== 10) {
			/* Then go to sequence/:name page */
			const clickedSeq = this.props.sequences[cellMeta.rowIndex];
			this.props.history.push(
				this.props.location.pathname +
					'/' +
					encodeURIComponent(clickedSeq.name),
			);
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
			customToolbar: this.renderFilterToolbar,
			onCellClick: this.onCellClick,
		};
	};

	render() {
		const { sequences, loading, hasloaded } = this.props;
		return (
			<>
				{loading && renderLoadingBars()}
				<>
					{hasloaded && (
						<MuiDataTable
							data={sequences}
							columns={columns}
							options={this.getTableOptions()}
							title={'Sequences'}
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
	sequences: selectors.getSequencesTable,
	page: selectors.getTablePage,
	total: selectors.getCount,
	rowsPerPage: selectors.getTableRows,
	orderby: selectors.getTableSort,
	filtersSet: selectors.getFilters,
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
		{ requestSequences },
	),
)(ListSequences);
