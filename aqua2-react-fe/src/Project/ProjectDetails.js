import React, { Component } from 'react';
import { renderLoadingBars } from '../common/renderHelpers';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { requestProjectDetails } from './project_actions';
import { getProjectObj, getHasLoaded } from './project_selectors';

const styles = (theme) => ({
	root: {
		minWidth: 500,
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		paddingLeft: theme.spacing.unit * 2,
		paddingRight: theme.spacing.unit * 2,
	},
	noBorder: {
		borderBottom: 'none',
		verticalAlign: 'top',
	},
	noHover: { pointerEvents: 'none' },
});

class ProjectDetails extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.requestProjectDetails();
		}
	}

	render() {
		const { project, loaded, classes } = this.props;

		if (loaded) {
			return (
				<Paper className={classes.root} elevation={1}>
					<Table>
						<TableBody>
							<TableRow className={classes.noHover}>
								<TableCell align="left" className={classes.noBorder}>
									<Typography variant="h6">Project:</Typography>
								</TableCell>
								<TableCell align="left" className={classes.noBorder}>
									<Typography variant="body1">{project.longTitle}</Typography>
								</TableCell>
							</TableRow>
							<TableRow className={classes.noHover}>
								<TableCell align="left" className={classes.noBorder}>
									<Typography variant="h6">Description:</Typography>
								</TableCell>
								<TableCell align="left" className={classes.noBorder}>
									<Typography variant="body1">{project.description}</Typography>
								</TableCell>
							</TableRow>
							<TableRow className={classes.noHover}>
								<TableCell align="left" className={classes.noBorder}>
									<Typography variant="h6">Contacts:</Typography>
								</TableCell>
								<TableCell align="left" className={classes.noBorder}>
									<Typography variant="body1">{project.contacts}</Typography>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
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
const mapStateToProps = createStructuredSelector({
	loaded: getHasLoaded,
	project: getProjectObj,
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		{ requestProjectDetails },
	),
)(ProjectDetails);
