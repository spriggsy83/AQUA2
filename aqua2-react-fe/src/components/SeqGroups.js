import React, { Component } from "react";
import MuiDataTable from "mui-datatables";
import LinearProgress from "@material-ui/core/LinearProgress";
import NumberFormat from "react-number-format";
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
			{
				name: "Num. sequences",
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
			{
				name: "Average seq length",
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
			{
				name: "N50 seq length",
				options: {
					display: "hidden",
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
			{
				name: "Longest seq length",
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
			}
		];

		if (loaded) {
			return (
				<div>
					<MuiDataTable
						data={seqgroups}
						columns={columns}
						options={options}
						title={"SeqGroups"}
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
