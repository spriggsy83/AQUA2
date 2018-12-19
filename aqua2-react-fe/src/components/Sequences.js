import React, { Component } from "react";
import MuiDataTable from "mui-datatables";
import LinearProgress from "@material-ui/core/LinearProgress";
import API from "../API";
import SeqFilterBar from "./Sequences/SeqFilterBar";
import { map, pick, values } from "lodash";

class ListSequences extends Component {
	constructor(props) {
		super(props);
		this.onFilterChange = this.onFilterChange.bind(this);
		this.state = {
			page: 0,
			total: 0,
			rowsPerPage: 100,
			orderby: null,
			sequences: [],
			loading: true,
			filterBy: {}
		};
	}

	componentDidMount() {
		this.getData();
	}

	// Get initial data
	getData = () => {
		const { page, rowsPerPage, orderby } = this.state;
		const offset = page * rowsPerPage;
		API.get(
			`sequences?limit=${rowsPerPage}&offset=${offset}&sort=${orderby}`
		).then(res => {
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
			this.setState({
				sequences,
				total: res.data.total,
				loading: false,
				filterBy: res.data.filterby
			});
		});
	};

	// Get initial data
	onFilterChange = filterQ => {
		console.log(filterQ);
	};

	render() {
		const {
			page,
			total,
			rowsPerPage,
			sequences,
			loading,
			filterBy
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
						return value.toLocaleString();
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
			<div>
				{loading && (
					<div>
						<LinearProgress />
						<br />
						<LinearProgress color="secondary" />
					</div>
				)}
				{filterBy && (
					<div>
						<SeqFilterBar
							filterBy={filterBy}
							onFilterChange={this.onFilterChange}
						/>
					</div>
				)}
				<div>
					<MuiDataTable
						data={sequences}
						columns={columns}
						options={options}
						title={"Sequences"}
					/>
				</div>
				{loading && (
					<div>
						<LinearProgress />
						<br />
						<LinearProgress color="secondary" />
					</div>
				)}
			</div>
		);
	}
}

export default ListSequences;
