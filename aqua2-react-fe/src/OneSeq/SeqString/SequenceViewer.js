import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import { createStructuredSelector } from "reselect";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { renderLoadingBars } from "../../common/renderHelpers";
import SubseqSlider from "../components/SubseqSlider";
import { requestSeqString, requestSubseqString } from "./seqstring_actions";
import * as selectors from "./seqstring_selectors";

const styles = theme => ({
	switchblock: {
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		paddingLeft: theme.spacing.unit * 2,
		paddingRight: theme.spacing.unit * 2,
		justifyContent: "center",
		display: "inline-flex",
		alignItems: "center",
		width: "50%"
	}
});

class SequenceViewer extends Component {
	state = {
		viewSubstring: false,
		viewRevcomp: false
	};

	componentDidMount() {
		this.props.requestSeqString();
	}

	handleSwitchChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	render() {
		//const { seqName, loading, hasloaded, errorMsg, classes } = this.props;
		const { loading, seqStr, classes } = this.props;
		const { viewSubstring, viewRevcomp } = this.state;
		console.log(seqStr);
		return (
			<>
				{loading && renderLoadingBars()}
				<Paper className={classes.switchblock}>
					<Typography>Full sequence</Typography>
					<Switch
						checked={this.state.viewSubstring}
						onChange={this.handleSwitchChange("viewSubstring")}
						value="viewSubstring"
						color="primary"
					/>
					<Typography>Subsequence</Typography>
				</Paper>
				<Paper className={classes.switchblock}>
					<Typography>Forward orientation</Typography>
					<Switch
						checked={this.state.viewRevcomp}
						onChange={this.handleSwitchChange("viewRevcomp")}
						value="viewRevcomp"
						color="primary"
					/>
					<Typography>Reverse complement</Typography>
				</Paper>
				{viewSubstring && (
					<SubseqSlider subseqStart={100} subseqEnd={1000} seqLength={5000} />
				)}
				{loading && renderLoadingBars()}
			</>
		);
	}
}

/**
 * allows us to call our application state from props
 */
const mapStateToProps = createStructuredSelector({
	hasloaded: selectors.getHasLoaded,
	loading: selectors.getIsLoading,
	errorMsg: selectors.getError,
	seqID: selectors.getSeqID,
	seqStr: selectors.getSeqString,
	subHasLoaded: selectors.getSubseqHasLoaded,
	subLoading: selectors.getSubseqIsLoading,
	subError: selectors.getSubseqError,
	subseqStr: selectors.getSubseqString,
	subseqStart: selectors.getSubseqStart,
	subseqEnd: selectors.getSubseqEnd
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	withStyles(styles),
	connect(
		mapStateToProps,
		{ requestSeqString, requestSubseqString }
	)
)(SequenceViewer);
