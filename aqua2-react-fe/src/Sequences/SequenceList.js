import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { map, at, isEqual, isEmpty, reduce } from "lodash";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import MuiDataTable from "mui-datatables";
import API from "../common/API";
import { renderNumber, renderLoadingBars } from "../common/renderHelpers";
import SeqFilterBar from "./components/SeqFilterBar";
import { createStructuredSelector } from "reselect";
import { requestSequences } from "./sequences_actions";
import { getSequencesTable, getHasLoaded } from "./sequences_selectors";
import {
	actions as SampleActions,
	selectors as SampleSelectors
} from "../Samples";
import {
	actions as SeqGroupActions,
	selectors as SeqGroupSelectors
} from "../SeqGroups";
import {
	actions as SeqTypeActions,
	selectors as SeqTypeSelectors
} from "../SeqTypes";
const requestSamples = SampleActions.requestSamples;
const requestSeqGroups = SeqGroupActions.requestSeqGroups;
const requestSeqTypes = SeqTypeActions.requestSeqTypes;

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
		filterOpts: {},
		filtersSet: {},
		filtersChecked: {},
		isFilterShowing: false
	};

	componentDidMount() {
		if (!this.props.samplesLoaded) {
			this.props.requestSamples();
		}
		if (!this.props.seqtypesLoaded) {
			this.props.requestSeqTypes();
		}
		if (!this.props.seqgroupsLoaded) {
			this.props.requestSeqGroups();
		}
		this.getData();
	}

	/** Get initial data **/
	getData = () => {
		const {
			page,
			rowsPerPage,
			orderby,
			filtersSet,
			filterOpts
		} = this.state;
		this.props.requestSequences({
			page: page,
			rowsPerPage: rowsPerPage,
			orderby: orderby,
			filtersSet: filtersSet
		});
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
			if (isEqual(filterOpts, res.data.filterby)) {
				this.setState({
					sequences,
					total: res.data.total,
					loading: false
				});
			} else {
				this.setState({
					sequences,
					total: res.data.total,
					loading: false,
					filterOpts: res.data.filterby,
					filtersChecked: reduce(
						res.data.filterby,
						function(result, value, key) {
							result[key] = [];
							return result;
						},
						{}
					)
				});
			}
		});
	};

	/** SeqFilterBar checkbox ticked/unticked **/
	onFilterChange = (tablename, checkList) => {
		this.setState(prevState => ({
			filtersChecked: {
				...prevState.filtersChecked,
				[tablename]: checkList
			}
		}));
	};

	/** SeqFilterBar submitting new filter list **/
	onFilterSubmit = () => {
		const { filtersChecked, filterOpts, filtersSet } = this.state;
		var newFiltersSet = reduce(
			filtersChecked,
			function(result, flist, tablename) {
				if (flist.length) {
					result[tablename] = map(flist, label => {
						return filterOpts[tablename][label];
					});
				}
				return result;
			},
			{}
		);
		if (!isEqual(newFiltersSet, filtersSet)) {
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
		}
	};

	/** Show/hide SeqFilterBar **/
	onFilterHiderClick = () => {
		this.setState(prevState => ({
			isFilterShowing: !prevState.isFilterShowing
		}));
	};

	/** SeqFilterBar contains checkbox filter controls **/
	renderFilterToolbar = () => {
		const { filterOpts, filtersChecked, isFilterShowing } = this.state;
		if (filterOpts) {
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
							checked={filtersChecked}
							filterOpts={filterOpts}
							onFilterChange={this.onFilterChange}
							onFilterSubmit={this.onFilterSubmit}
						/>
					)}
				</>
			);
		}
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
		console.log(this.props.filterOpts);
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

/**
 * allows us to call our application state from props
 */
const mapStateToProps = createStructuredSelector({
	loaded: getHasLoaded,
	sequences: getSequencesTable,
	samplesLoaded: SampleSelectors.getHasLoaded,
	seqtypesLoaded: SeqTypeSelectors.getHasLoaded,
	seqgroupsLoaded: SeqGroupSelectors.getHasLoaded,
	filterOpts: createStructuredSelector({
		sample: SampleSelectors.getNamesIDsList,
		seqgroup: SeqGroupSelectors.getNamesIDsList,
		seqtype: SeqTypeSelectors.getNamesIDsList
	})
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ requestSequences, requestSamples, requestSeqGroups, requestSeqTypes }
	)
)(ListSequences);
