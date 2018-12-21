import React, { Component } from "react";
import MuiDataTable from "mui-datatables";
import LinearProgress from "@material-ui/core/LinearProgress";
import { renderNumber } from "../UI/renderHelpers";
import { map, pick, values } from "lodash";
import { connect } from "react-redux";
import { getSeqTypes } from "../actions/seqtypes_actions.js";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
	narrowlist: {
		width: 500
	}
});

class ListSeqTypes extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.getSeqTypes();
		}
	}

	render() {
		const { seqtypes, loaded, classes } = this.props;
		const options = {
			pagination: false,
			viewColumns: false,
			selectableRows: false,
			search: false,
			filter: false,
			rowsPerPage: 999
		};
		const columns = [
			{ name: "dbID", options: { display: "excluded" } },
			{ name: "Seq Type", options: { sort: true } },
			{
				name: "Num. sequences",
				options: {
					sort: true,
					customBodyRender: renderNumber
				}
			}
		];

		if (loaded) {
			return (
				<div className={classes.narrowlist}>
					<MuiDataTable
						data={seqtypes}
						columns={columns}
						options={options}
						title={"SeqTypes"}
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
	var seqtypes = [];
	if (state.seqtypes.seqtypes.length) {
		seqtypes = map(state.seqtypes.seqtypes, seqtype => {
			return values(pick(seqtype, ["id", "type", "numseqs"]));
		});
	}
	return {
		loaded: state.seqtypes.loaded,
		seqtypes: seqtypes
	};
}

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		{ getSeqTypes }
	)
)(ListSeqTypes);
