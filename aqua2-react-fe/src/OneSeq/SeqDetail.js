import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import { createStructuredSelector } from "reselect";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import { renderLoadingBars } from "../common/renderHelpers";
import SubseqSlider from "./components/SubseqSlider";
import SequenceViewer from "./components/SequenceViewer";
import AnnotTabViewer from "./components/AnnotTabViewer";
import RelationshipViewer from "./components/RelationshipViewer";
import { requestOneSeq } from "./oneseq_actions";
import {
	getHasLoaded,
	getIsLoading,
	getError,
	getSeqID,
	getSeqName,
	getSeqDetail,
	getSeqDetailTable,
	getSubseqStart,
	getSubseqEnd
} from "./oneseq_selectors";

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

class SeqDetail extends Component {
	state = {
		subseqStart: 1,
		subseqEnd: 10
	};

	componentDidMount() {
		var seqName = this.props.match.params.sequence_name;
		var subseqStart = null;
		var subseqEnd = null;
		if (this.props.location.search) {
			var matchArr = /^\?(\d+)-(\d+)$/.exec(this.props.location.search);
			if (matchArr) {
				subseqStart = parseInt(matchArr[1]);
				subseqEnd = parseInt(matchArr[2]);
				if (subseqStart > subseqEnd) {
					// One line swap!
					[subseqStart, subseqEnd] = [subseqEnd, subseqStart];
				}
				this.setState({
					subseqStart: subseqStart,
					subseqEnd: subseqEnd
				});
			}
		}
		if (seqName !== this.props.seqName || !this.props.hasloaded) {
			this.props.requestOneSeq({
				name: seqName,
				subseqStart: subseqStart,
				subseqEnd: subseqEnd
			});
		} else if (
			subseqStart !== this.props.subseqStart ||
			subseqEnd !== this.props.subseqEnd
		) {
			// To handle!!
			// Change of sub sequence
		}
	}

	renderSeqList = () => {
		const { seqDetailTab, classes } = this.props;
		return (
			<List>
				{seqDetailTab.map(function(field, index) {
					var [fieldLabel, fieldValue, fieldLink] = field;
					if (fieldLabel === "External link") {
						return (
							<a
								href={fieldLink}
								target="_blank"
								style={{ textDecoration: "none" }}
								rel="noopener noreferrer"
								key={index + "-extlink"}
							>
								<ListItem button>
									<ListItemText primary={fieldLabel} />
									<ListItemText
										className={classes.rightjust}
										primary={fieldValue}
									/>
								</ListItem>
							</a>
						);
					} else if (fieldLink) {
						return (
							<Link
								to={fieldLink}
								style={{ textDecoration: "none" }}
								key={index + "-link"}
							>
								<ListItem button>
									<ListItemText primary={fieldLabel} />
									<ListItemText
										className={classes.rightjust}
										primary={fieldValue}
									/>
								</ListItem>
							</Link>
						);
					} else {
						return (
							<ListItem key={index + "-listitem"}>
								<ListItemText primary={fieldLabel} />
								<ListItemText
									className={classes.rightjust}
									primary={fieldValue}
								/>
							</ListItem>
						);
					}
				})}
			</List>
		);
	};

	render() {
		const {
			seqName,
			seqDetail,
			subseqStart,
			subseqEnd,
			loading,
			hasloaded,
			errorMsg,
			classes
		} = this.props;
		return (
			<>
				<Paper className={classes.narrowlist} elevation={1}>
					<Typography variant="h6">{seqName}:</Typography>
					{loading && renderLoadingBars()}
					{errorMsg && <Typography>{errorMsg}</Typography>}
					{hasloaded && this.renderSeqList()}
					{hasloaded && (
						<SubseqSlider
							subseqStart={subseqStart}
							subseqEnd={subseqEnd}
							seqLength={seqDetail["length"]}
						/>
					)}
					{loading && renderLoadingBars()}
				</Paper>
				{hasloaded && <SequenceViewer />}
				{hasloaded && <AnnotTabViewer />}
				{hasloaded && <RelationshipViewer />}
			</>
		);
	}
}

/**
 * allows us to call our application state from props
 */
const mapStateToProps = createStructuredSelector({
	hasloaded: getHasLoaded,
	loading: getIsLoading,
	errorMsg: getError,
	seqID: getSeqID,
	seqName: getSeqName,
	seqDetail: getSeqDetail,
	seqDetailTab: getSeqDetailTable,
	subseqStart: getSubseqStart,
	subseqEnd: getSubseqEnd
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	withStyles(styles),
	connect(
		mapStateToProps,
		{ requestOneSeq }
	)
)(SeqDetail);
