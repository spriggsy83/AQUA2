import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { requestSearch } from './search_actions';
import { getSearchTerm, getSearchType } from './search_selectors';

const styles = (theme) => ({
	root: {
		display: 'inline-flex',
		flexWrap: 'nowrap',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	textField: {
		margin: theme.spacing.unit,
		minWidth: 140,
	},
	iconButton: {
		padding: 8,
	},
	divider: {
		width: 1,
		height: 28,
		margin: 4,
	},
});

class SearchBar extends Component {
	state = {
		searchtext: '',
		searchtype: 'annots',
	};

	/** Search box text changed **/
	updateSearchText = (event) => {
		this.setState({
			searchtext: event.target.value,
		});
	};

	/** Search type selection change **/
	onTypeChange = (event) => {
		this.setState({
			searchtype: event.target.value,
		});
	};

	onSearchSubmit = () => {
		const { searchtext, searchtype } = this.state;
		const { prevSearchTerm, prevSearchType, location } = this.props;
		if (searchtext !== '') {
			if (searchtext !== prevSearchTerm || searchtype !== prevSearchType) {
				this.props.requestSearch({
					searchTerm: searchtext,
					searchType: searchtype,
				});
			}
			if (location.pathname !== '/Search') {
				this.props.history.push('/Search');
			}
		}
	};

	onKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.onSearchSubmit();
		}
	};

	renderTypeSelect = () => {
		const { classes } = this.props;
		return (
			<FormControl className={classes.textField}>
				<Select
					value={this.state.searchtype}
					onChange={this.onTypeChange}
					inputProps={{
						id: 'searchtype-select',
					}}
					disableUnderline={true}
				>
					<MenuItem value={'seqs'}>sequence IDs</MenuItem>
					<MenuItem value={'annots'}>annotations</MenuItem>
					<MenuItem value={'all'}>seqs & annots</MenuItem>
				</Select>
			</FormControl>
		);
	};

	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root} elevation={1}>
				<InputBase
					id="searchtextbox"
					className={classes.textField}
					placeholder="Search"
					onChange={this.updateSearchText}
					onKeyDown={this.onKeyPress}
					inputProps={{
						style: { textAlign: 'right' },
					}}
				/>
				<Typography variant="subtitle1">in</Typography>
				<Tooltip id="sfilter-button-tip" title="Search what?">
					{this.renderTypeSelect()}
				</Tooltip>
				<Divider className={classes.divider} />
				<Tooltip id="search-button-tip" title="Search">
					<IconButton
						id="search-button"
						className={classes.iconButton}
						aria-label="Search"
						onClick={this.onSearchSubmit}
					>
						<SearchIcon />
					</IconButton>
				</Tooltip>
			</Paper>
		);
	}
}

/**
 * allows us to call our application state from props
 */
const mapStateToProps = createStructuredSelector({
	prevSearchTerm: getSearchTerm,
	prevSearchType: getSearchType,
});

/**
 * Defines required props
 */
SearchBar.propTypes = {
	classes: PropTypes.object.isRequired,
};

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withStyles(styles, { withTheme: true }),
	withRouter,
	connect(
		mapStateToProps,
		{ requestSearch },
	),
)(SearchBar);
