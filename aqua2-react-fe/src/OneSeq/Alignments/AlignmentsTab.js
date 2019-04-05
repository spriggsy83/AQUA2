import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import MuiDataTable from 'mui-datatables';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { renderLoadingBars } from '../../common/renderHelpers';
import { requestAlignments, changeColumnView } from './alignments_actions';
import * as selectors from './alignments_selectors';
import { getAlignmentsColumns } from './alignments_columns';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
	},
	row: {
		display: 'inline-flex',
		padding: theme.spacing.unit * 2,
		alignItems: 'center',
		width: '100%',
	},
	seqbox: {
		padding: theme.spacing.unit * 2,
		overflowY: 'scroll',
		maxHeight: '50vh',
	},
	button: {
		margin: theme.spacing.unit,
	},
	slider: {
		margin: theme.spacing.unit * 2,
		flexGrow: 1,
	},
});

class AlignmentsTab extends Component {
	state = {
		sliderSubStart: 1,
		sliderSubEnd: 1,
	};

	componentDidMount() {
		const { subseqStart, subseqEnd, hasloaded } = this.props;
		this.setState({
			sliderSubStart: subseqStart,
			sliderSubEnd: subseqEnd,
		});
		if (!hasloaded) {
			this.getData();
		}
	}

	getData = ({
		newPage,
		newRowsPerPage,
		newOrderby,
		newFiltersSet,
		newSubseqStart,
		newSubseqEnd,
	} = {}) => {
		const {
			page,
			rowsPerPage,
			orderby,
			filtersSet,
			subseqStart,
			subseqEnd,
		} = this.props;
		this.props.requestAlignments({
			page: newPage !== undefined ? newPage : page,
			rowsPerPage: newRowsPerPage !== undefined ? newRowsPerPage : rowsPerPage,
			orderby: newOrderby !== undefined ? newOrderby : orderby,
			filtersSet: newFiltersSet !== undefined ? newFiltersSet : filtersSet,
			newSubseqStart:
				newSubseqStart !== undefined ? newSubseqStart : subseqStart,
			newSubseqEnd: newSubseqEnd !== undefined ? newSubseqEnd : subseqEnd,
		});
	};

	/** SeqFilterBar submitting new filter list **/
	onFilterSubmit = (newFiltersSet) => {
		this.getData({ newPage: 0, newFiltersSet: newFiltersSet });
	};

	/** Table sort changed **/
	onColumnSortChange = (col, direction) => {
		var dir = direction.replace(/(asc|desc)ending/, '$1');
		this.getData({ newPage: 0, newOrderby: `${col} ${dir}` });
	};

	/** Table column view on/off change **/
	onColumnViewChange = (col, value) => {
		this.props.changeColumnView(col, value === 'add' ? 'true' : 'false');
	};

	/** Table page changed **/
	onTableChange = (action, tableState) => {
		const { page, rowsPerPage } = this.props;
		const newPage = tableState.page;
		const newRowsPerPage = tableState.rowsPerPage;
		if (newPage !== page || newRowsPerPage !== rowsPerPage) {
			this.getData({ newPage: newPage, newRowsPerPage: newRowsPerPage });
		}
	};

	onCellClick = (colData, cellMeta) => {
		const { alignments } = this.props;
		/* If NOT Annotations column clicked */
		if (cellMeta.colIndex !== 19) {
			const clicked = alignments[cellMeta.rowIndex];
			/* If a valid ref seq row clicked */
			if (clicked.featureId && clicked.featureAlignStart) {
				/* Then go to sequence/:name page */
				const seqName = clicked.featureName;
				const start = clicked.featureAlignStart;
				const end = clicked.featureAlignEnd;
				this.props.history.push({
					pathname: '/Sequences/' + encodeURIComponent(seqName),
					search:
						'?' + encodeURIComponent(start) + '-' + encodeURIComponent(end),
				});
			}
		}
	};

	handleSliderChange = (value) => {
		this.setState({ sliderSubStart: value[0], sliderSubEnd: value[1] });
	};

	handleNewRangeSubmit = () => {
		const { sliderSubStart, sliderSubEnd } = this.state;
		this.getData({
			newSubseqStart: sliderSubStart,
			newSubseqEnd: sliderSubEnd,
		});
	};

	renderSubSeqControl = () => {
		const { classes, seqLength, subseqStart, subseqEnd } = this.props;
		return (
			<>
				<Typography>Query range:</Typography>
				<div className={classes.slider}>
					<Range
						min={1}
						max={seqLength}
						marks={{
							1: 1,
							[subseqStart]: subseqStart.toLocaleString(),
							[subseqEnd]: subseqEnd.toLocaleString(),
							[seqLength]: seqLength.toLocaleString(),
						}}
						defaultValue={[subseqStart, subseqEnd]}
						onChange={this.handleSliderChange}
					/>
				</div>
				<Button
					variant="contained"
					aria-label="Update"
					size="small"
					className={classes.button}
					onClick={this.handleNewRangeSubmit}
				>
					Update
				</Button>
			</>
		);
	};

	/** options Object required by mui-datatable **/
	getTableOptions = () => {
		const { page, total, rowsPerPage } = this.props;
		return {
			pagination: true,
			viewColumns: true,
			selectableRows: false,
			search: false,
			filter: false,
			rowsPerPageOptions: [50, 100, 200, 1000],
			rowsPerPage: rowsPerPage,
			page: page,
			count: total,
			serverSide: true,
			onTableChange: this.onTableChange,
			onColumnSortChange: this.onColumnSortChange,
			onColumnViewChange: this.onColumnViewChange,
			onCellClick: this.onCellClick,
		};
	};

	render() {
		const { classes, loading, hasloaded, alignments, columns } = this.props;
		return (
			<div className={classes.root}>
				<Paper className={classes.row}>{this.renderSubSeqControl()}</Paper>
				{loading && renderLoadingBars()}
				{hasloaded && (
					<MuiDataTable
						data={alignments}
						columns={columns}
						options={this.getTableOptions()}
					/>
				)}
				{loading && renderLoadingBars()}
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
	alignments: selectors.getAlignmentsTable,
	seqLength: selectors.getSeqLength,
	subseqStart: selectors.getSubseqStart,
	subseqEnd: selectors.getSubseqEnd,
	page: selectors.getTablePage,
	total: selectors.getCount,
	rowsPerPage: selectors.getTableRows,
	orderby: selectors.getTableSort,
	filtersSet: selectors.getFilters,
	columns: getAlignmentsColumns,
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	withStyles(styles),
	connect(
		mapStateToProps,
		{ requestAlignments, changeColumnView },
	),
)(AlignmentsTab);
