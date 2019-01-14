import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import compose from "recompose/compose";
import { map, at, isEmpty, isArray } from "lodash";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import MuiDataTable from "mui-datatables";
import API from "../common/API";
import { renderNumber, renderLoadingBars } from "../common/renderHelpers";
import SeqFilterBar from "./components/SeqFilterBar";

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
		page: 0,
		total: 0,
		rowsPerPage: 100,
		orderby: null,
		sequences: [],
		loading: true,
		filtersSet: {},
		isFilterShowing: false
	};

	componentDidMount() {
		this.getData();
	}

	/** Get initial data **/
	getData = () => {
		const { page, rowsPerPage, orderby, filtersSet } = this.state;
		const offset = page * rowsPerPage;
		var qParams = {
			limit: rowsPerPage,
			offset: offset
		};
		if (orderby) {
			qParams["sort"] = orderby;
		}
		if (!isEmpty(filtersSet)) {
			qParams["filter"] = filtersSet;
		}
		API.get(`sequences`, {
			params: qParams
		}).then(res => {
			if (isArray(res.data.data)) {
				const sequences = map(res.data.data, sequence => {
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
				this.setState({
					sequences,
					total: res.data.total,
					loading: false
				});
			} else {
				this.setState({
					sequences: [],
					total: 0,
					loading: false
				});
			}
		});
	};

	/** SeqFilterBar submitting new filter list **/
	onFilterSubmit = newFiltersSet => {
		this.setState(
			{
				loading: true,
				page: 0,
				filtersSet: newFiltersSet
			},
			() => {
				this.getData();
			}
		);
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
					<SeqFilterBar onFilterSubmit={this.onFilterSubmit} />
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
		this.setState(
			{
				loading: true,
				orderby: `${col} ${dir}`,
				page: 0
			},
			() => {
				this.getData();
			}
		);
	};

	/** Table page changed **/
	onTableChange = (action, tableState) => {
		const { page, rowsPerPage } = this.state;
		if (
			tableState.page !== page ||
			tableState.rowsPerPage !== rowsPerPage
		) {
			this.setState(
				{
					loading: true,
					page: tableState.page,
					rowsPerPage: tableState.rowsPerPage
				},
				() => {
					this.getData();
				}
			);
		}
	};

	onCellClick = (colData, cellMeta) => {
		/* If NOT ExtLink column clicked */
		if (cellMeta.colIndex !== 10) {
			/* Then go to sequence/:name page */
			const clickedSeq = this.state.sequences[cellMeta.rowIndex];
			this.props.history.push(
				this.props.location.pathname +
					"/" +
					encodeURIComponent(clickedSeq[1])
			);
		}
	};

	/** options Object required by mui-datatable **/
	getTableOptions = () => {
		const { page, total, rowsPerPage } = this.state;
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
		const { sequences, loading } = this.state;
		return (
			<>
				{loading && renderLoadingBars()}
				<>
					<MuiDataTable
						data={sequences}
						columns={columns}
						options={this.getTableOptions()}
						title={"Sequences"}
					/>
				</>
				{loading && renderLoadingBars()}
			</>
		);
	}
}

export default compose(withRouter)(ListSequences);
