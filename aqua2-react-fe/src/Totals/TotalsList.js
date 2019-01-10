import React, { Component } from "react";
import { renderLoadingBars } from "../common/renderHelpers";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { requestTotals } from "./totals_actions.js";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
	narrowlist: {
		width: 500,
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		paddingLeft: theme.spacing.unit * 2,
		paddingRight: theme.spacing.unit * 2
	},
	rightjust: { display: "flex", justifyContent: "flex-end" }
});

class ListTotals extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.requestTotals();
		}
	}

	renderTotalsList = () => {
		const { totals, classes } = this.props;
		return (
			<List>
				{totals.map(function(total, index) {
					return (
						<Link
							to={total[2]}
							style={{ textDecoration: "none" }}
							key={index + "-totlink"}
						>
							<ListItem button>
								<ListItemText primary={total[0]} />
								<ListItemText
									className={classes.rightjust}
									primary={total[1]}
								/>
							</ListItem>
						</Link>
					);
				})}
			</List>
		);
	};

	render() {
		const { loaded, classes } = this.props;

		if (loaded) {
			return (
				<Paper className={classes.narrowlist} elevation={1}>
					<Typography variant="h6">
						Sequence/Annotation data loaded:
					</Typography>
					{this.renderTotalsList()}
				</Paper>
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
	if (state.totals.loaded) {
		const totalObj = state.totals.totals;
		return {
			loaded: state.totals.loaded,
			totals: [
				["Samples", totalObj["sample"].toLocaleString(), "/Samples"],
				[
					"Groups/Assemblies",
					totalObj["seqgroup"].toLocaleString(),
					"/SeqGroups"
				],
				[
					"Sequences",
					totalObj["sequence"].toLocaleString(),
					"/Sequences"
				],
				[
					"Sequence interrelations",
					totalObj["seqrelation"].toLocaleString(),
					"/"
				],
				[
					"Alignment-based annotations",
					totalObj["alignedannot"].toLocaleString(),
					"/"
				],
				[
					"Gene predictions",
					totalObj["geneprediction"].toLocaleString(),
					"/"
				]
			]
		};
	} else {
		return {
			loaded: state.totals.loaded,
			totals: []
		};
	}
}

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		{ requestTotals }
	)
)(ListTotals);
