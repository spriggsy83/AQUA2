import React, { Component } from "react";
import MuiDataTable from "mui-datatables";
import LinearProgress from "@material-ui/core/LinearProgress";
import API from "../API";
import SeqFilterBar from "./Sequences/SeqFilterBar";
import { map, pick, values, isEqual, isEmpty, reduce } from "lodash";
import NumberFormat from "react-number-format";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";

class ListSequences extends Component {
	constructor(props) {
		super(props);
		this.onFilterChange = this.onFilterChange.bind(this);
		this.onFilterSubmit = this.onFilterSubmit.bind(this);
		this.onFilterHiderClick = this.onFilterHiderClick.bind(this);
		this.state = {
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
	}

	componentDidMount() {
		this.getData();
	}

	// Get initial data
	getData = () => {
		const {
			page,
			rowsPerPage,
			orderby,
			filtersSet,
			filterOpts
		} = this.state;
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
				return values(
					pick(sequence, [
						"id",
						"name",
						"length",
						"groupId",
						"groupName",
						"sampleId",
						"sampleName",
						"typeId",
						"typeName",
						"annotNote",
						"extLink"
					])
				);
			});
			if (isEqual(filterOpts, res.data.filterby)) {
				this.setState({
					sequences,
					total: res.data.total,
					isFilterShowing: false,
					loading: false
				});
			} else {
				this.setState({
					sequences,
					total: res.data.total,
					loading: false,
					isFilterShowing: false,
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

	// SeqFilterBar checkbox ticked/unticked
	onFilterChange = (tablename, checkList) => {
		this.setState(prevState => ({
			filtersChecked: {
				...prevState.filtersChecked,
				[tablename]: checkList
			}
		}));
	};

	// SeqFilterBar submitting new filter list
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

	onFilterHiderClick = () => {
		this.setState(prevState => ({
			isFilterShowing: !prevState.isFilterShowing
		}));
	};

	render() {
		const {
			page,
			total,
			rowsPerPage,
			sequences,
			loading,
			filterOpts,
			filtersChecked,
			isFilterShowing
		} = this.state;
		const options = {
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
			onTableChange: (action, tableState) => {
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
			},
			onColumnSortChange: (changedColumn, direction) => {
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
			},
			customToolbar: () => {
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
			}
		};
		const columns = [
			{ name: "dbID", options: { display: "excluded" } },
			{ name: "Name", options: { sort: true } },
			{
				name: "Length (bp)",
				options: {
					sort: true,
					customBodyRender: (value, tableMeta, updateValue) => {
						return (
							<NumberFormat
								value={value}
								displayType={"text"}
								thousandSeparator={true}
								style={{ float: "right" }}
							/>
						);
					}
				}
			},
			{ name: "groupId", options: { display: "excluded" } },
			{ name: "Group", options: { sort: true } },
			{ name: "sampleId", options: { display: "excluded" } },
			{ name: "Sample", options: { sort: true } },
			{ name: "typeId", options: { display: "excluded" } },
			{ name: "Type", options: { sort: true } },
			{ name: "Annotation note", options: { sort: false } },
			{
				name: "External link",
				options: {
					sort: false,
					customBodyRender: (value, tableMeta, updateValue) => {
						if (value)
							return (
								<a
									href={value}
									target="_blank"
									rel="noopener noreferrer"
								>
									link
								</a>
							);
						else return;
					}
				}
			}
		];

		return (
			<>
				{loading && (
					<>
						<LinearProgress />
						<br />
						<LinearProgress color="secondary" />
					</>
				)}
				<>
					<MuiDataTable
						data={sequences}
						columns={columns}
						options={options}
						title={"Sequences"}
					/>
				</>
				{loading && (
					<>
						<LinearProgress />
						<br />
						<LinearProgress color="secondary" />
					</>
				)}
			</>
		);
	}
}

export default ListSequences;
