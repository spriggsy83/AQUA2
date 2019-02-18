import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import { createStructuredSelector } from "reselect";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { renderLoadingBars } from "../../common/renderHelpers";
import { requestSeqString, requestSubseqString } from "./seqstring_actions";
import * as selectors from "./seqstring_selectors";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const styles = theme => ({
	root: {
		display: "flex",
		flexDirection: "column",
		width: "100%"
	},
	row: {
		display: "inline-flex",
		padding: theme.spacing.unit * 2,
		alignItems: "center",
		width: "100%"
	},
	switchblock: {
		padding: theme.spacing.unit * 2,
		justifyContent: "center",
		display: "inline-flex",
		alignItems: "center",
		flexGrow: 1
	},
	seqbox: {
		padding: theme.spacing.unit * 2,
		overflowY: "scroll",
		maxHeight: "50vh"
	},
	seqfont: {
		whiteSpace: "pre-line",
		fontFamily: "courier"
	},
	button: {
		margin: theme.spacing.unit
	},
	slider: {
		margin: theme.spacing.unit * 2,
		flexGrow: 1
	}
});

class SequenceViewer extends Component {
	state = {
		viewSubstring: false,
		viewRevcomp: false,
		sliderSubStart: 1,
		sliderSubEnd: 1
	};

	componentDidMount() {
		const { subseqStart, subseqEnd, seqLength } = this.props;
		var viewSubstring = false;
		if (subseqStart && subseqEnd && seqLength) {
			if (subseqStart > 1 || subseqEnd !== seqLength) {
				viewSubstring = true;
				this.props.requestSubseqString({
					subseqStart: subseqStart,
					subseqEnd: subseqEnd
				});
			} else {
				this.props.requestSeqString();
			}
		} else {
			this.props.requestSeqString();
		}
		this.setState({
			viewSubstring: viewSubstring,
			sliderSubStart: subseqStart,
			sliderSubEnd: subseqEnd
		});
	}

	/*componentDidUpdate(prevProps) {
		if (this.props.subseqStart !== prevProps.subseqStart) {
			this.setState({ sliderSubStart: this.props.subseqStart });
		}
		if (this.props.subseqEnd !== prevProps.subseqEnd) {
			this.setState({ sliderSubEnd: this.props.subseqEnd });
		}
	}*/

	handleSwitchChange = name => event => {
		const { loading, hasloaded, subLoading, subHasLoaded } = this.props;
		if (name === "viewSubstring") {
			if (event.target.checked) {
				if (!(subLoading || subHasLoaded)) {
					this.props.requestSubseqString();
				}
			} else {
				if (!(loading || hasloaded)) {
					this.props.requestSeqString();
				}
			}
		}
		this.setState({ [name]: event.target.checked });
	};

	handleSliderChange = value => {
		this.setState({ sliderSubStart: value[0], sliderSubEnd: value[1] });
	};

	handleNewRangeSubmit = () => {
		const { sliderSubStart, sliderSubEnd } = this.state;
		this.props.requestSubseqString({
			subseqStart: sliderSubStart,
			subseqEnd: sliderSubEnd
		});
	};

	renderLoading = () => {
		const { loading, subLoading } = this.props;
		const { viewSubstring } = this.state;
		if (viewSubstring) {
			if (subLoading) {
				return renderLoadingBars();
			}
		} else if (loading) {
			return renderLoadingBars();
		}
	};

	renderSeq = () => {
		const {
			hasloaded,
			subHasLoaded,
			errorMsg,
			subErrorMsg,
			seqStr,
			subseqStr,
			revComp,
			subRevComp,
			classes
		} = this.props;
		const { viewSubstring, viewRevcomp } = this.state;
		if (viewSubstring) {
			if (subHasLoaded) {
				if (subErrorMsg) {
					return <Typography>{errorMsg}</Typography>;
				} else if (viewRevcomp) {
					return (
						<Typography className={classes.seqfont}>{subRevComp}</Typography>
					);
				} else {
					return (
						<Typography className={classes.seqfont}>{subseqStr}</Typography>
					);
				}
			}
		} else if (hasloaded) {
			if (errorMsg) {
				return <Typography>{errorMsg}</Typography>;
			} else if (viewRevcomp) {
				return <Typography className={classes.seqfont}>{revComp}</Typography>;
			} else {
				return <Typography className={classes.seqfont}>{seqStr}</Typography>;
			}
		}
	};

	renderSubSeqControl = () => {
		const { classes, seqLength, subseqStart, subseqEnd } = this.props;
		return (
			<>
				<Typography>Range:</Typography>
				<div className={classes.slider}>
					<Range
						min={1}
						max={seqLength}
						marks={{
							1: 1,
							[subseqStart]: subseqStart.toLocaleString(),
							[subseqEnd]: subseqEnd.toLocaleString(),
							[seqLength]: seqLength.toLocaleString()
						}}
						defaultValue={[subseqStart, subseqEnd]}
						onChange={this.handleSliderChange}
					/>
				</div>
				<Button
					variant="contained"
					size="medium"
					color="primary"
					className={classes.button}
					onClick={this.handleNewRangeSubmit}
				>
					Update
				</Button>
			</>
		);
	};

	render() {
		const { classes } = this.props;
		const { viewSubstring } = this.state;
		return (
			<div className={classes.root}>
				<div className={classes.row}>
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
				</div>

				{viewSubstring && (
					<Paper className={classes.row}>{this.renderSubSeqControl()}</Paper>
				)}
				{this.renderLoading()}
				<Paper className={classes.seqbox}>{this.renderSeq()}</Paper>
				{this.renderLoading()}
			</div>
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
	seqLength: selectors.getSeqLength,
	seqStr: selectors.getFormattedSeqstr,
	subHasLoaded: selectors.getSubseqHasLoaded,
	subLoading: selectors.getSubseqIsLoading,
	subErrorMsg: selectors.getSubseqError,
	subseqStr: selectors.getFormattedSubseqStr,
	subseqStart: selectors.getSubseqStart,
	subseqEnd: selectors.getSubseqEnd,
	revComp: selectors.getFormattedRevComp,
	subRevComp: selectors.getFormattedRevCompSubseq
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
