import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import MuiDataTable from 'mui-datatables';
import { renderNumber, renderLoadingBars } from '../common/renderHelpers';
import { createStructuredSelector } from 'reselect';
import { requestSamples } from './samples_actions';
import { getSamplesTable, getHasLoaded } from './samples_selectors';
import { requestSequences } from '../Sequences/sequences_actions';

const columns = [
	{
		name: 'id',
		label: 'dbID',
		options: { display: 'excluded', download: false },
	},
	{
		name: 'name',
		label: 'Sample Name',
		options: { display: 'true', sort: true },
	},
	{
		name: 'species',
		label: 'Species',
		options: { display: 'true', sort: true },
	},
	{
		name: 'description',
		label: 'Description',
		options: { display: 'true', sort: false },
	},
	{
		name: 'ingroups',
		label: 'In groups/assemblies',
		options: {
			display: 'true',
			sort: true,
			customBodyRender: renderNumber,
		},
	},
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

class ListSamples extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.requestSamples();
		}
	}

	onRowClick = (rowData, rowMeta) => {
		this.props.requestSequences({
			page: 0,
			filtersSet: {
				sample: [rowData[0]],
			},
		});
		this.props.history.push('/Sequences');
	};

	render() {
		const { samples, loaded } = this.props;
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
				<>
					<MuiDataTable
						data={samples}
						columns={columns}
						options={options}
						title={'Samples'}
					/>
				</>
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
	samples: getSamplesTable,
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ requestSamples, requestSequences },
	),
)(ListSamples);
