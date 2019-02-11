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
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import { renderLoadingBars, UnderConstruction } from "../common/renderHelpers";
import { requestOneSeq } from "./oneseq_actions";
import * as selectors from "./oneseq_selectors";
import { SequenceViewer } from "./SeqString";

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
		expanded: null
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
					// One-liner value swap :o
					[subseqStart, subseqEnd] = [subseqEnd, subseqStart];
				}
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

	handleSectionChange = panel => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false
		});
	};

	renderFeatureAccordion = () => {
		const { expanded } = this.state;
		return (
			<>
				<ExpansionPanel
					expanded={expanded === "seqstring"}
					onChange={this.handleSectionChange("seqstring")}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Sequence viewer</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{expanded === "seqstring" && <SequenceViewer />}
					</ExpansionPanelDetails>
				</ExpansionPanel>
				<ExpansionPanel
					expanded={expanded === "annottab"}
					onChange={this.handleSectionChange("annottab")}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Annotations table</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{expanded === "annottab" && <UnderConstruction />}
					</ExpansionPanelDetails>
				</ExpansionPanel>
				<ExpansionPanel
					expanded={expanded === "hierarchyviz"}
					onChange={this.handleSectionChange("hierarchyviz")}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Relationship viewer</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{expanded === "hierarchyviz" && <UnderConstruction />}
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</>
		);
	};

	render() {
		const { seqName, loading, hasloaded, errorMsg, classes } = this.props;
		return (
			<>
				<Paper className={classes.narrowlist} elevation={1}>
					<Typography variant="h6">{seqName}:</Typography>
					{loading && renderLoadingBars()}
					{errorMsg && <Typography>{errorMsg}</Typography>}
					{hasloaded && this.renderSeqList()}
					{loading && renderLoadingBars()}
				</Paper>
				{hasloaded && this.renderFeatureAccordion()}
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
	seqName: selectors.getSeqName,
	seqDetail: selectors.getSeqDetail,
	seqDetailTab: selectors.getSeqDetailTable
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
