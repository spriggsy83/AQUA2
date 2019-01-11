import React, { Component } from "react";
import MuiDataTable from "mui-datatables";
import { connect } from "react-redux";
import { renderNumber, renderLoadingBars } from "../common/renderHelpers";
import { createStructuredSelector } from "reselect";
import { requestSeqGroups } from "./seqgroups_actions";
import { getSeqGroupsTable, getStatus } from "./seqgroups_selectors";

const columns = [
	{ name: "dbID", options: { display: "excluded" } },
	{ name: "Group Name", options: { sort: true } },
	{ name: "Description", options: { sort: false } },
	{
		name: "From samples",
		options: {
			display: "hidden",
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
	},
	{
		name: "Average seq length",
		options: {
			sort: true,
			customBodyRender: renderNumber
		}
	},
	{
		name: "N50 seq length",
		options: {
			display: "hidden",
			sort: true,
			customBodyRender: renderNumber
		}
	},
	{
		name: "Longest seq length",
		options: {
			sort: true,
			customBodyRender: renderNumber
		}
	}
];

class ListSeqGroups extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.requestSeqGroups();
		}
	}

	render() {
		const { seqgroups, loaded } = this.props;
		const options = {
			pagination: false,
			viewColumns: true,
			selectableRows: false,
			search: false,
			filter: false,
			rowsPerPage: 999
		};
		if (loaded) {
			return (
				<>
					<MuiDataTable
						data={seqgroups}
						columns={columns}
						options={options}
						title={"Groups/Assemblies"}
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
	loaded: getStatus,
	seqgroups: getSeqGroupsTable
});

/**
 * exports our component and gives it access to the redux state
 */
export default connect(
	mapStateToProps,
	{ requestSeqGroups }
)(ListSeqGroups);
