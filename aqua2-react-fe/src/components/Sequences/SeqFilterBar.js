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
import { map } from "lodash";

const styles = theme => ({
	root: {
		display: "inline-flex",
		flexWrap: "nowrap",
		justifyContent: "flex-end",
		borderWidth: "1px",
		borderStyle: "solid",
		borderColor: "rgb(224, 224, 224)"
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 90,
		maxWidth: 150
	},
	margin: {
		margin: theme.spacing.unit
	},
	smallText: {
		fontSize: 10
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
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange = source => event => {
		this.props.onFilterChange(source, event.target.value);
	};

	handleClick = event => {
		this.props.onFilterSubmit();
	};

	renderFilterLists = () => {
		const { classes, filterOpts, checked } = this.props;
		return map(Object.keys(filterOpts), tablename => {
			return (
				<FormControl
					className={classes.formControl}
					key={`filtermenu-${tablename}`}
				>
					<InputLabel
						htmlFor={`select-${tablename}-checkbox`}
						className={classes.smallText}
					>
						{tablename}
					</InputLabel>
					<Select
						multiple
						value={checked[tablename]}
						onChange={this.handleChange(tablename)}
						input={
							<Input
								id={`select-${tablename}-checkbox`}
								className={classes.smallText}
							/>
						}
						renderValue={selected => selected.join(", ")}
						MenuProps={MenuProps}
					>
						{this.renderFListRows(tablename)}
					</Select>
				</FormControl>
			);
		});
	};

	renderFListRows = tablename => {
		const { filterOpts, checked } = this.props;
		const fList = filterOpts[tablename];
		return map(Object.keys(fList), rowlabel => {
			return (
				<MenuItem
					key={`filtercheck-${tablename}-${rowlabel}`}
					value={rowlabel}
				>
					<Checkbox
						checked={checked[tablename].indexOf(rowlabel) > -1}
					/>
					<ListItemText primary={rowlabel} />
				</MenuItem>
			);
		});
	};

	render() {
		const { classes, filterOpts } = this.props;
		if (filterOpts) {
			if (Object.keys(filterOpts).length > 0) {
				return (
					<div className={classes.root}>
						<Button
							variant="outlined"
							size="small"
							className={classes.margin + " " + classes.smallText}
							onClick={this.handleClick}
						>
							Filter:
						</Button>
						{this.renderFilterLists()}
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
	checked: PropTypes.object.isRequired,
	filterOpts: PropTypes.object.isRequired,
	onFilterChange: PropTypes.func.isRequired,
	onFilterSubmit: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SeqFilterBar);
