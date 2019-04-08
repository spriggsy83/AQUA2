import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import MuiDataTable from 'mui-datatables';
import { renderNumber, renderLoadingBars } from '../common/renderHelpers';
import { createStructuredSelector } from 'reselect';
import { requestSeqGroups } from './seqgroups_actions';
import { getSeqGroupsTable, getHasLoaded } from './seqgroups_selectors';
import { requestSequences } from '../Sequences/sequences_actions';

const columns = [
	{
		name: 'id',
		label: 'dbID',
		options: { display: 'excluded', download: false },
	},
	{
		name: 'name',
		label: 'Group Name',
		options: { display: 'true', sort: true },
	},
	{
		name: 'description',
		label: 'Description',
		options: { display: 'true', sort: false },
	},
	{
		name: 'fromsamps',
		label: 'From samples',
		options: {
			display: 'false',
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
	{
		name: 'avlength',
		label: 'Average seq length',
		options: {
			display: 'true',
			sort: true,
			customBodyRender: renderNumber,
		},
	},
	{
		name: 'n50length',
		label: 'N50 seq length',
		options: {
			display: 'false',
			sort: true,
			customBodyRender: renderNumber,
		},
	},
	{
		name: 'maxlength',
		label: 'Longest seq length',
		options: {
			display: 'true',
			sort: true,
			customBodyRender: renderNumber,
		},
	},
];

class ListSeqGroups extends Component {
	componentDidMount() {
		if (!this.props.loaded) {
			// Get initial data
			this.props.requestSeqGroups();
		}
	}

	onRowClick = (rowData, rowMeta) => {
		this.props.requestSequences({
			page: 0,
			filtersSet: {
				seqgroup: [rowData[0]],
			},
		});
		this.props.history.push('/Sequences');
	};

	render() {
		const { seqgroups, loaded } = this.props;
		const options = {
			pagination: false,
			viewColumns: true,
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
						data={seqgroups}
						columns={columns}
						options={options}
						title={'Groups/Assemblies'}
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
	seqgroups: getSeqGroupsTable,
});

/**
 * exports our component and gives it access to the redux state
 */
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ requestSeqGroups, requestSequences },
	),
)(ListSeqGroups);
