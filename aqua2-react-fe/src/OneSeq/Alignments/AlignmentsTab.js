import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
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
import { renderNumber, renderLoadingBars } from '../../common/renderHelpers';
import { requestAlignments } from './alignments_actions';
import * as selectors from './alignments_selectors';

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

const columns = [
	{ name: 'featureType', label: 'Type', options: { sort: true } },
	{ name: 'featureId', options: { display: 'excluded', download: false } },
	{ name: 'featureName', label: 'Feature name', options: { sort: true } },
	{
		name: 'seqLength',
		label: 'Length of aligned seq',
		options: { display: 'false', sort: true, customBodyRender: renderNumber },
	},
	{
		name: 'seqGroupName',
		label: 'Group of aligned seq',
		options: { display: 'false', sort: true },
	},
	{
		name: 'seqSampleName',
		label: 'Sample of aligned seq',
		options: { display: 'false', sort: true },
	},
	{
		name: 'seqTypeName',
		label: 'Type of aligned seq',
		options: { display: 'false', sort: true },
	},
	{
		name: 'alignStart',
		label: 'Start',
		options: { display: 'false', sort: true, customBodyRender: renderNumber },
	},
	{
		name: 'alignEnd',
		label: 'End',
		options: { display: 'false', sort: true, customBodyRender: renderNumber },
	},
	{
		name: 'alignCoords',
		label: 'Align Coords',
		options: { sort: false, download: false },
	},
	{
		name: 'alignStrand',
		label: 'Strand',
		options: { display: 'false', sort: true },
	},
	{
		name: 'featureAlignStart',
		label: 'Start on aligned seq',
		options: { display: 'false', sort: false, customBodyRender: renderNumber },
	},
	{
		name: 'featureAlignEnd',
		label: 'End on aligned seq',
		options: { display: 'false', sort: false, customBodyRender: renderNumber },
	},
	{
		name: 'featureAlignCoords',
		label: 'Coords on aligned seq',
		options: { display: 'false', sort: false, download: false },
	},
	{
		name: 'source',
		label: 'Source',
		options: { sort: false, download: false },
	},
	{
		name: 'featureSpecies',
		label: 'Species',
		options: { display: 'false', sort: true },
	},
	{
		name: 'featureSource',
		label: 'Data source',
		options: { display: 'false', sort: true },
	},
	{
		name: 'method',
		label: 'Method',
		options: { display: 'false', sort: true },
	},
	{ name: 'score', label: 'Score', options: { display: 'false', sort: false } },
	{
		name: 'featureAnnot',
		label: 'Annotation',
		options: {
			sort: false,
			customBodyRender: renderAnnotsCol,
		},
	},
	{
		name: 'isCdsName',
		label: 'CDS seq name',
		options: { display: 'false', sort: false },
	},
	{
		name: 'isProtName',
		label: 'Protein seq name',
		options: { display: 'false', sort: false },
	},
	{
		name: 'subParts',
		label: 'Sub-parts',
		options: { sort: true, customBodyRender: renderNumber },
	},
];

function renderAnnotsCol(colvalue) {
	var valueTest = /^Has CDS: (\S+), Has Protein: (\S+)$/i.exec(colvalue);
	if (valueTest) {
		return (
			<>
				{'Has CDS: '}
				<Link to={'/sequences/' + valueTest[1]}>{valueTest[1]}</Link>
				{', Has Protein: '}
				<Link to={'/sequences/' + valueTest[2]}>{valueTest[2]}</Link>
			</>
		);
	}
	valueTest = /^Has (CDS|Protein): (\S+)$/i.exec(colvalue);
	if (valueTest) {
		return (
			<>
				Has {valueTest[1]}:&nbsp;
				<Link to={'/sequences/' + valueTest[2]}>{valueTest[2]}</Link>
			</>
		);
	}
	return <>{colvalue}</>;
}

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
			//customToolbar: this.renderSubSeqControl,
			onCellClick: this.onCellClick,
		};
	};

	render() {
		const { classes, loading, hasloaded, alignments } = this.props;
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
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	withStyles(styles),
	connect(
		mapStateToProps,
		{ requestAlignments },
	),
)(AlignmentsTab);
