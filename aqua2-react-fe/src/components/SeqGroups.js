import React, { Component } from "react";
import MuiDataTable from "mui-datatables";
import LinearProgress from "@material-ui/core/LinearProgress";
import { renderNumber } from "../UI/renderHelpers";
import { map, pick, values } from "lodash";
import { connect } from "react-redux";
import { getSeqGroups } from "../actions/seqgroups_actions.js";

class ListSeqGroups extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.getSeqGroups();
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

		if (loaded) {
			return (
				<div>
					<MuiDataTable
						data={seqgroups}
						columns={columns}
						options={options}
						title={"Groups/Assemblies"}
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

/**
 * allows us to call our application state from props
 */
function mapStateToProps(state) {
	var seqgroups = [];
	if (state.seqgroups.seqgroups.length) {
		seqgroups = map(state.seqgroups.seqgroups, seqgroup => {
			return values(
				pick(seqgroup, [
					"id",
					"name",
					"description",
					"fromsamps",
					"numseqs",
					"avlength",
					"n50length",
					"maxlength"
				])
			);
		});
	}
	return {
		loaded: state.seqgroups.loaded,
		seqgroups: seqgroups
	};
}

/**
 * exports our component and gives it access to the redux state
 */
export default connect(
	mapStateToProps,
	{ getSeqGroups }
)(ListSeqGroups);
