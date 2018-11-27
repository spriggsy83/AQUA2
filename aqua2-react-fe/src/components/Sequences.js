import React, { Component } from "react";
//import axios from "axios";
import API from '../API';
import MuiDataTable from "mui-datatables";
import { map, pick, values } from "lodash";

class ListSequences extends Component {
	state = {
		page: 0,
		total: 0,
		rowsPerPage: 20,
		sequences: []
	};

	componentDidMount() {
		this.getData();
	}

	// Get initial data
	getData = () => {
		const { page, rowsPerPage } = this.state;
		const offset = page*rowsPerPage;
		API.get(`sequences?limit=${rowsPerPage}&offset=${offset}`).then(res => {
			const sequences = map(res.data.data, sequence => {
				return values(pick(sequence, 
					["id", "name", "length", "groupId", "groupName", "sampleId", "sampleName", 
					"typeId", "typeName", "annotNote", "extLink"]));
			});
			this.setState({ sequences, total: res.data.total });
		});
	}

	render() {
		const { page, total, rowsPerPage, sequences } = this.state;
		const options = {
			pagination: true,
			viewColumns: false,
			selectableRows: false,
			filter: false,
			rowsPerPageOptions: [ 20, 50, 100, 200 ],
			rowsPerPage: rowsPerPage,
			page: page,
			count: total,
			serverSide: true,
			onTableChange: (action, tableState) => {
				console.log(tableState);
				this.setState({ page: tableState.page, rowsPerPage: tableState.rowsPerPage}, () => {
					this.getData();
				});
			}
		};
		const columns = [
			{ name:"dbID", options: {display: 'excluded'} },
            "Name", 
            { name:"Length (bp)", options: { 
					customBodyRender: (value, tableMeta, updateValue) => {
						return (value.toLocaleString())
					} 
			} }, 
            { name:"groupId", options: {display: 'excluded'} },
            "Group", 
            { name:"sampleId", options: {display: 'excluded'} }, 
            "Sample", 
            { name:"typeId", options: {display: 'excluded'} }, 
            "Type", 
            "Annotation note", 
            { name:"External link", options: { 
					customBodyRender: (value, tableMeta, updateValue) => {
						if(value)
							return (<a href={value}>link</a>)
						else
							return;
					} 
				} }, 
			];
		return (
			<div>
				<MuiDataTable
					data={sequences}
					columns={columns}
					options={options}
					title={"Sequences"}
				/>
			</div>
		);
	}
}

export default ListSequences;
