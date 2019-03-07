import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import OkIcon from '@material-ui/icons/Check';
import UndoIcon from '@material-ui/icons/Undo';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import { renderLoadingBars, UnderConstruction } from '../common/renderHelpers';
import { requestOneSeq, patchOneSeq } from './oneseq_actions';
import * as selectors from './oneseq_selectors';
import { SequenceViewer } from './SeqString';

const styles = (theme) => ({
	root: {
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		paddingLeft: theme.spacing.unit * 2,
		paddingRight: theme.spacing.unit * 2,
	},
	narrowlist: {
		width: 500,
	},
	rightjust: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	margin: {
		margin: theme.spacing.unit,
	},
	rightMargin: {
		marginRight: theme.spacing.unit,
	},
	textField: {
		flexGrow: 1,
	},
});

class SeqDetail extends Component {
	state = {
		expanded: null,
		editAnnot: false,
		draftAnnotNote: '',
	};

	componentDidMount() {
		// Required to capture Escape key press
		window.addEventListener('keydown', this.textEditKeyPress);

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
				subseqEnd: subseqEnd,
			});
		} else if (
			subseqStart !== this.props.subseqStart ||
			subseqEnd !== this.props.subseqEnd
		) {
			// To handle!!
			// Change of sub sequence
		}
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.textEditKeyPress);
	}

	renderSeqList = () => {
		const { seqDetailTab, classes } = this.props;
		return (
			<List>
				{seqDetailTab.map(function(field, index) {
					var [fieldLabel, fieldValue, fieldLink] = field;
					if (fieldLabel === 'External link') {
						return (
							<a
								href={fieldLink}
								target="_blank"
								style={{ textDecoration: 'none' }}
								rel="noopener noreferrer"
								key={index + '-extlink'}
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
								style={{ textDecoration: 'none' }}
								key={index + '-link'}
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
					} else if (fieldLabel !== 'Annotation/note') {
						return (
							<ListItem key={index + '-listitem'}>
								<ListItemText primary={fieldLabel} />
								<ListItemText
									className={classes.rightjust}
									primary={fieldValue}
								/>
							</ListItem>
						);
					} else {
						return null;
					}
				})}
			</List>
		);
	};

	toggleEditAnnot = () => {
		const { editAnnot } = this.state;
		const { seqDetail } = this.props;
		const seqAnnot = seqDetail.annotNote || '';
		if (editAnnot) {
			this.setState({
				editAnnot: false,
			});
		} else {
			this.setState({
				editAnnot: true,
				draftAnnotNote: seqAnnot,
			});
		}
		return;
	};

	textEditKeyPress = (event) => {
		const { editAnnot } = this.state;
		if (editAnnot) {
			if (event.key === 'Enter') {
				this.submitNewAnnotNote();
			} else if (event.key === 'Escape') {
				this.setState({ editAnnot: false });
			}
		}
		return;
	};

	handleAnnotTextChange = (event) => {
		this.setState({ draftAnnotNote: event.target.value });
	};

	submitNewAnnotNote = () => {
		const { draftAnnotNote } = this.state;
		const { seqDetail } = this.props;
		const seqAnnot = seqDetail.annotNote || '';
		if (seqAnnot !== draftAnnotNote) {
			this.props.patchOneSeq({
				id: this.props.seqID,
				annotNote: this.state.draftAnnotNote,
			});
		}
		this.setState({ editAnnot: false });
	};

	renderAnnotNotes = () => {
		const { seqDetail, classes } = this.props;
		const seqAnnot = seqDetail.annotNote || '';
		const { editAnnot, draftAnnotNote } = this.state;

		if (editAnnot) {
			return (
				<ListItem>
					<ListItemText primary="Annotation/note" />
					<TextField
						className={classes.textField}
						id="annot-text"
						value={draftAnnotNote}
						inputProps={{ maxLength: 255 }}
						margin="normal"
						autoFocus
						onChange={(e) => this.handleAnnotTextChange(e)}
					/>
					<Button
						variant="contained"
						aria-label="Submit"
						size="small"
						className={classes.margin}
						onClick={(e) => this.submitNewAnnotNote()}
					>
						<OkIcon className={classes.rightMargin} />
						Submit
					</Button>
					<Button
						variant="contained"
						aria-label="Submit"
						size="small"
						className={classes.margin}
						onClick={(e) => this.toggleEditAnnot()}
					>
						<UndoIcon className={classes.rightMargin} />
						Cancel
					</Button>
				</ListItem>
			);
		} else {
			return (
				<ListItem onClick={(e) => this.toggleEditAnnot()}>
					<ListItemText primary="Annotation/note" />
					<ListItemText primary={seqAnnot} />
					<Button
						variant="contained"
						size="small"
						aria-label="Edit"
						className={classes.margin}
						onClick={(e) => this.toggleEditAnnot()}
					>
						<EditIcon className={classes.rightMargin} />
						Edit
					</Button>
				</ListItem>
			);
		}
	};

	handleSectionChange = (panel) => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false,
		});
	};

	renderFeatureAccordion = () => {
		const { expanded } = this.state;
		return (
			<>
				<ExpansionPanel
					expanded={expanded === 'seqstring'}
					onChange={this.handleSectionChange('seqstring')}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Sequence viewer</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{expanded === 'seqstring' && <SequenceViewer />}
					</ExpansionPanelDetails>
				</ExpansionPanel>
				<ExpansionPanel
					expanded={expanded === 'annottab'}
					onChange={this.handleSectionChange('annottab')}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Annotations table</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{expanded === 'annottab' && <UnderConstruction />}
					</ExpansionPanelDetails>
				</ExpansionPanel>
				<ExpansionPanel
					expanded={expanded === 'hierarchyviz'}
					onChange={this.handleSectionChange('hierarchyviz')}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Relationship viewer</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{expanded === 'hierarchyviz' && <UnderConstruction />}
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</>
		);
	};

	render() {
		const { loading, hasloaded, errorMsg, classes } = this.props;
		return (
			<>
				<Paper className={classes.root} elevation={1}>
					<Typography variant="h6">Sequence detail:</Typography>
					{loading && renderLoadingBars()}
					{errorMsg && <Typography>{errorMsg}</Typography>}
					<div className={classes.narrowlist}>
						{hasloaded && this.renderSeqList()}
					</div>
					{hasloaded && this.renderAnnotNotes()}
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
	seqDetailTab: selectors.getSeqDetailTable,
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	withStyles(styles),
	connect(
		mapStateToProps,
		{ requestOneSeq, patchOneSeq },
	),
)(SeqDetail);
