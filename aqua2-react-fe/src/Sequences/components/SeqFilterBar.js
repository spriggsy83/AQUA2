import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { createStructuredSelector } from "reselect";
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
import { map, isEqual, reduce } from "lodash";
import { renderLoadingBars } from "../../common/renderHelpers";
import {
	actions as SampleActions,
	selectors as SampleSelectors
} from "../../Samples";
import {
	actions as SeqGroupActions,
	selectors as SeqGroupSelectors
} from "../../SeqGroups";
import {
	actions as SeqTypeActions,
	selectors as SeqTypeSelectors
} from "../../SeqTypes";
const requestSamples = SampleActions.requestSamples;
const requestSeqGroups = SeqGroupActions.requestSeqGroups;
const requestSeqTypes = SeqTypeActions.requestSeqTypes;

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
	state = {
		checked: { sample: [], seqtype: [], seqgroup: [] }
	};

	componentDidMount() {
		if (!this.props.samplesLoaded) {
			this.props.requestSamples();
		}
		if (!this.props.seqtypesLoaded) {
			this.props.requestSeqTypes();
		}
		if (!this.props.seqgroupsLoaded) {
			this.props.requestSeqGroups();
		}
	}

	/** Check boxes checked/unchecked **/
	handleChange = source => event => {
		// Source == sample/seqtype/seqgroup
		// event.target.value == Array of checked idNums
		this.setState(prevState => ({
			checked: {
				...prevState.checked,
				[source]: event.target.value
			}
		}));
	};

	/** Submit/Filter button clicked **/
	handleClick = event => {
		const { checked } = this.state;
		const { filterOpts, filtersSet } = this.props;
		// Convert list of checked names to list of idNums
		var newFiltersSet = reduce(
			checked,
			function(result, flist, tablename) {
				if (flist.length) {
					result[tablename] = map(flist, label => {
						return filterOpts[tablename][label];
					});
				}
				return result;
			},
			{}
		);
		if (!isEqual(newFiltersSet, filtersSet)) {
			// If not current filterSet, submit upwards
			this.props.onFilterSubmit(newFiltersSet);
		}
	};

	renderFilterLists = () => {
		const { checked } = this.state;
		const { classes, filterOpts } = this.props;
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
		const { checked } = this.state;
		const { filterOpts } = this.props;
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
		const {
			classes,
			samplesLoaded,
			seqtypesLoaded,
			seqgroupsLoaded
		} = this.props;
		if (samplesLoaded && seqtypesLoaded && seqgroupsLoaded) {
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
			return renderLoadingBars();
		}
	}
}

/**
 * Defines required props
 */
SeqFilterBar.propTypes = {
	filtersSet: PropTypes.object,
	onFilterSubmit: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

/**
 * allows us to call our application state from props
 */
const mapStateToProps = createStructuredSelector({
	samplesLoaded: SampleSelectors.getHasLoaded,
	seqtypesLoaded: SeqTypeSelectors.getHasLoaded,
	seqgroupsLoaded: SeqGroupSelectors.getHasLoaded,
	filterOpts: createStructuredSelector({
		sample: SampleSelectors.getNamesIDsList,
		seqgroup: SeqGroupSelectors.getNamesIDsList,
		seqtype: SeqTypeSelectors.getNamesIDsList
	})
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withStyles(styles, { withTheme: true }),
	connect(
		mapStateToProps,
		{ requestSamples, requestSeqGroups, requestSeqTypes }
	)
)(SeqFilterBar);
