import React, { Component } from "react";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
	root: {
		display: "inline-flex",
		flexWrap: "nowrap",
		justifyContent: "flex-end",
		alignItems: "center"
	},
	textField: {
		margin: theme.spacing.unit,
		minWidth: 140
	},
	iconButton: {
		padding: 8
	},
	divider: {
		width: 1,
		height: 28,
		margin: 4
	}
});

class SearchBar extends Component {
	state = {
		searchtext: "",
		searchtype: "seqs"
	};

	/** Search box text changed **/
	updateSearchText = event => {
		this.setState({
			searchtext: event.target.value
		});
	};

	/** Search type selection change **/
	onTypeChange = event => {
		this.setState({
			searchtype: event.target.value
		});
	};

	onSearchSubmit = () => {
		console.log("Submit");
	};

	onKeyPress = event => {
		if (event.key === "Enter") {
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
						id: "searchtype-select"
					}}
					disableUnderline={true}
				>
					<MenuItem value={"seqs"}>Sequence IDs</MenuItem>
					<MenuItem value={"annots"}>Annotations</MenuItem>
					<MenuItem value={"all"}>Seqs & annots</MenuItem>
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
				/>
				<Typography variant="h6">:</Typography>
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
 * Defines required props
 */
SearchBar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default compose(withStyles(styles, { withTheme: true }))(SearchBar);
