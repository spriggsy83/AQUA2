import React, { Component } from "react";
import MuiDataTable from "mui-datatables";
import LinearProgress from "@material-ui/core/LinearProgress";
import { map, pick, values } from "lodash";
import { connect } from "react-redux";
import { getSamples } from "../actions/samples_actions.js";

class ListSamples extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
			samples: []
		};
	}

	componentDidMount() {
		this.getData();
	}

	// Get initial data
	getData = () => {
		this.props.getSamples();
	};

	render() {
		const { samples, loaded } = this.props;
		const options = {
			pagination: false,
			viewColumns: false,
			selectableRows: false,
			filter: false,
			rowsPerPage: 999
		};
		const columns = [
			{ name: "dbID", options: { display: "excluded" } },
			{ name: "Sample Name", options: { sort: true } },
			{ name: "Species", options: { sort: true } },
			{ name: "Description", options: { sort: false } },
			{
				name: "In groups/assemblies",
				options: {
					sort: true,
					customBodyRender: (value, tableMeta, updateValue) => {
						return value.toLocaleString();
					}
				}
			},
			{
				name: "Num. sequences",
				options: {
					sort: true,
					customBodyRender: (value, tableMeta, updateValue) => {
						return value.toLocaleString();
					}
				}
			}
		];

		if (loaded) {
			return (
				<div>
					<MuiDataTable
						data={samples}
						columns={columns}
						options={options}
						title={"Samples"}
					/>
				</div>
			);
		} else {
			return (
				<div>
					<LinearProgress />
					<br />
					<LinearProgress color="secondary" />
				</div>
			);
		}
	}
}

//export default ListSamples;

/**
 * allows us to call our application state from props
 */
function mapStateToProps(state) {
	var samples = [];
	if (state.samples.samples.length) {
		samples = map(state.samples.samples, sample => {
			return values(
				pick(sample, [
					"id",
					"name",
					"species",
					"description",
					"ingroups",
					"numseqs"
				])
			);
		});
	}
	return {
		loaded: state.samples.loaded,
		samples: samples
	};
}

/**
 * exports our component and gives it access to the redux state
 */
export default connect(
	mapStateToProps,
	{ getSamples }
)(ListSamples);
