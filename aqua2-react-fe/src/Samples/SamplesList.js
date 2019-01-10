import React, { Component } from "react";
import MuiDataTable from "mui-datatables";
import { map, at } from "lodash";
import { connect } from "react-redux";
import { renderNumber, renderLoadingBars } from "../common/renderHelpers";
import { getSamples } from "./samples_actions.js";

const columns = [
	{ name: "dbID", options: { display: "excluded" } },
	{ name: "Sample Name", options: { sort: true } },
	{ name: "Species", options: { sort: true } },
	{ name: "Description", options: { sort: false } },
	{
		name: "In groups/assemblies",
		options: {
			sort: true,
			customBodyRender: renderNumber
		}
	},
	{
		name: "Num. sequences",
		options: {
			sort: true,
			customBodyRender: renderNumber
		}
	}
];

class ListSamples extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.getSamples();
		}
	}

	render() {
		const { samples, loaded } = this.props;
		const options = {
			pagination: false,
			viewColumns: false,
			selectableRows: false,
			search: false,
			filter: false,
			rowsPerPage: 999
		};

		if (loaded) {
			return (
				<>
					<MuiDataTable
						data={samples}
						columns={columns}
						options={options}
						title={"Samples"}
					/>
				</>
			);
		} else {
			return renderLoadingBars();
		}
	}
}

/**
 * allows us to call our application state from props
 */
function mapStateToProps(state) {
	var samples = [];
	if (state.samples.samples.length) {
		samples = map(state.samples.samples, sample => {
			return at(sample, [
				"id",
				"name",
				"species",
				"description",
				"ingroups",
				"numseqs"
			]);
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
