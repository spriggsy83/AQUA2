import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MuiDataTable from 'mui-datatables';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { renderNumber, renderLoadingBars } from '../common/renderHelpers';
import { createStructuredSelector } from 'reselect';
import { requestSeqTypes } from './seqtypes_actions';
import { getSeqTypesTable, getHasLoaded } from './seqtypes_selectors';

const styles = (theme) => ({
	narrowlist: {
		width: 500,
	},
});

const columns = [
	{
		name: 'id',
		label: 'dbID',
		options: { display: 'excluded', download: false },
	},
	{ name: 'type', label: 'Seq Type', options: { display: 'true', sort: true } },
	{
		name: 'numseqs',
		label: 'Num. sequences',
		options: {
			display: 'true',
			sort: true,
			customBodyRender: renderNumber,
		},
	},
];

class ListSeqTypes extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.requestSeqTypes();
		}
	}

	onRowClick = (rowData, rowMeta) => {
		this.props.history.push(
			this.props.location.pathname + '/' + encodeURIComponent(rowData[1]),
		);
	};

	render() {
		const { seqtypes, loaded, classes } = this.props;
		const options = {
			pagination: false,
			viewColumns: false,
			selectableRows: false,
			search: false,
			filter: false,
			rowsPerPage: 999,
			onRowClick: this.onRowClick,
		};

		if (loaded) {
			return (
				<div className={classes.narrowlist}>
					<MuiDataTable
						data={seqtypes}
						columns={columns}
						options={options}
						title={'SeqTypes'}
					/>
				</div>
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
	seqtypes: getSeqTypesTable,
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withStyles(styles),
	withRouter,
	connect(
		mapStateToProps,
		{ requestSeqTypes },
	),
)(ListSeqTypes);
