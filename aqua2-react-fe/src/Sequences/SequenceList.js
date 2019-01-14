import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import compose from "recompose/compose";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import MuiDataTable from "mui-datatables";
import { renderNumber, renderLoadingBars } from "../common/renderHelpers";
import SeqFilterBar from "./components/SeqFilterBar";
import { createStructuredSelector } from "reselect";
import { requestSequences } from "./sequences_actions";
import {
	getHasLoaded,
	getIsLoading,
	getSequencesTable,
	getTablePage,
	getCount,
	getTableRows,
	getTableSort,
	getFilters
} from "./sequences_selectors";

const columns = [
	{ name: "dbID", options: { display: "excluded" } },
	{ name: "Name", options: { sort: true } },
	{
		name: "Length (bp)",
		options: {
			sort: true,
			customBodyRender: renderNumber
		}
	},
	{ name: "groupId", options: { display: "excluded" } },
	{ name: "Group", options: { sort: true } },
	{ name: "sampleId", options: { display: "excluded" } },
	{ name: "Sample", options: { sort: true } },
	{ name: "typeId", options: { display: "excluded" } },
	{ name: "Type", options: { sort: true } },
	{ name: "Annotation note", options: { sort: false } },
	{ name: "External link", options: { sort: false } }
];

class ListSequences extends Component {
	state = {
		isFilterShowing: false
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
			rowsPerPage:
				newRowsPerPage !== undefined ? newRowsPerPage : rowsPerPage,
			orderby: newOrderby !== undefined ? newOrderby : orderby,
			filtersSet: newFiltersSet !== undefined ? newFiltersSet : filtersSet
		});
	};

	/** SeqFilterBar submitting new filter list **/
	onFilterSubmit = newFiltersSet => {
		this.getData({ newPage: 0, newFiltersSet: newFiltersSet });
	};

	/** Show/hide SeqFilterBar **/
	onFilterHiderClick = () => {
		this.setState(prevState => ({
			isFilterShowing: !prevState.isFilterShowing
		}));
	};

	/** SeqFilterBar contains checkbox filter controls **/
	renderFilterToolbar = () => {
		const { isFilterShowing } = this.state;
		return (
			<>
				<Tooltip id="filter-button" title="Filter">
					<IconButton
						aria-label="Filter"
						onClick={this.onFilterHiderClick}
					>
						<FilterListIcon />
					</IconButton>
				</Tooltip>
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
	onColumnSortChange = (changedColumn, direction) => {
		var col = changedColumn
			.replace("Name", "name")
			.replace("Length (bp)", "length")
			.replace("Group", "groupName")
			.replace("Sample", "sampleName")
			.replace("Type", "typeName");
		var dir = direction.replace(/(asc|desc)ending/, "$1");
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
					"/" +
					encodeURIComponent(clickedSeq[1])
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
			rowsPerPageOptions: [50, 100, 200],
			rowsPerPage: rowsPerPage,
			page: page,
			count: total,
			serverSide: true,
			onTableChange: this.onTableChange,
			onColumnSortChange: this.onColumnSortChange,
			customToolbar: this.renderFilterToolbar,
			onCellClick: this.onCellClick
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
							title={"Sequences"}
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
	sequences: getSequencesTable,
	page: getTablePage,
	total: getCount,
	rowsPerPage: getTableRows,
	orderby: getTableSort,
	filtersSet: getFilters
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ requestSequences }
	)
)(ListSequences);
