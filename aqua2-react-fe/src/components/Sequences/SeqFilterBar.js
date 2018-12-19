import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import { map, forEach, find } from "lodash";

const styles = theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap"
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
		maxWidth: 300
	},
	margin: {
		margin: theme.spacing.unit
	}
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

class SeqFilterBar extends Component {
	constructor(props) {
		super(props);
		this.state = { checked: {} };
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		if (props.filterBy) {
			map(Object.keys(props.filterBy), table => {
				this.state.checked[table] = [];
			});
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props.filterBy) {
			if (
				Object.keys(props.filterBy).length !==
				Object.keys(state.checked).length
			) {
				let newState = { checked: {} };
				map(Object.keys(props.filterBy), table => {
					newState.checked[table] = [];
				});
				return newState;
			}
		}
		return null;
	}

	handleChange = source => event => {
		this.setState(prevState => ({
			...this.state,
			checked: {
				...this.state.checked,
				[source]: event.target.value
			}
		}));
	};

	handleClick = event => {
		var filterQ = {};
		forEach(this.state.checked, (list, table) => {
			if (list.length) {
				filterQ[table] = [];
				forEach(list, label => {
					filterQ[table].push(
						find(this.props.filterBy[table], x => {
							return x.label === label;
						}).id
					);
				});
			}
		});
		this.props.onFilterChange(filterQ);
	};

	render() {
		const { classes, filterBy } = this.props;
		if (filterBy) {
			if (Object.keys(filterBy).length > 0) {
				return (
					<div className={classes.root}>
						{map(Object.keys(filterBy), table => (
							<FormControl
								className={classes.formControl}
								key={`filtermenu-${table}`}
							>
								<InputLabel
									htmlFor={`select-${table}-checkbox`}
								>
									{table}
								</InputLabel>
								<Select
									multiple
									value={this.state.checked[table]}
									onChange={this.handleChange(table)}
									input={
										<Input
											id={`select-${table}-checkbox`}
										/>
									}
									renderValue={selected =>
										selected.join(", ")
									}
									MenuProps={MenuProps}
								>
									{map(filterBy[table], row => (
										<MenuItem
											key={`filtercheck-${table}-${
												row.id
											}`}
											value={row.label}
										>
											<Checkbox
												checked={
													this.state.checked[
														table
													].indexOf(row.label) > -1
												}
											/>
											<ListItemText primary={row.label} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
						))}
						<Button
							variant="contained"
							size="small"
							color="secondary"
							className={classes.margin}
							onClick={this.handleClick}
						>
							Filter
						</Button>
					</div>
				);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
}

SeqFilterBar.propTypes = {
	filterBy: PropTypes.object.isRequired,
	onFilterChange: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(SeqFilterBar);
