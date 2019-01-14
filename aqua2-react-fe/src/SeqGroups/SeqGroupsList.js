import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import compose from "recompose/compose";
import MuiDataTable from "mui-datatables";
import { renderNumber, renderLoadingBars } from "../common/renderHelpers";
import { createStructuredSelector } from "reselect";
import { requestSeqGroups } from "./seqgroups_actions";
import { getSeqGroupsTable, getHasLoaded } from "./seqgroups_selectors";

const columns = [
	{ name: "dbID", options: { display: "excluded", download: false } },
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

	onRowClick = (rowData, rowMeta) => {
		this.props.history.push(
			this.props.location.pathname + "/" + encodeURIComponent(rowData[1])
		);
	};

	render() {
		const { seqgroups, loaded } = this.props;
		const options = {
			pagination: false,
			viewColumns: true,
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
	loaded: getHasLoaded,
	seqgroups: getSeqGroupsTable
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ requestSeqGroups }
	)
)(ListSeqGroups);
