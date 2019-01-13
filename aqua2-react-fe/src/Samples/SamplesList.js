import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import compose from "recompose/compose";
import MuiDataTable from "mui-datatables";
import { renderNumber, renderLoadingBars } from "../common/renderHelpers";
import { createStructuredSelector } from "reselect";
import { requestSamples } from "./samples_actions";
import { getSamplesTable, getHasLoaded } from "./samples_selectors";

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
			this.props.requestSamples();
		}
	}

	onRowClick = (rowData, rowMeta) => {
		this.props.history.push(
			this.props.location.pathname + "/" + encodeURIComponent(rowData[1])
		);
	};

	render() {
		const { samples, loaded } = this.props;
		const options = {
			pagination: false,
			viewColumns: false,
			selectableRows: false,
			search: false,
			filter: false,
			rowsPerPage: 999,
			onRowClick: this.onRowClick
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
const mapStateToProps = createStructuredSelector({
	loaded: getHasLoaded,
	samples: getSamplesTable
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ requestSamples }
	)
)(ListSamples);
