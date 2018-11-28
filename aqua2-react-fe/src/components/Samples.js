import React, { Component } from "react";
//import axios from "axios";
import API from '../API';
import MuiDataTable from "mui-datatables";
import { map, pick, values } from "lodash";

class ListSamples extends Component {
	state = {
		page: 0,
		total: 0,
		rowsPerPage: 50,
		orderby: null,
		samples: []
	};

	componentDidMount() {
		this.getData();
	}

	// Get initial data
	getData = () => {
		const { page, rowsPerPage } = this.state;
		const offset = page*rowsPerPage;
		API.get(`samples?limit=${rowsPerPage}&offset=${offset}`).then(res => {
			const samples = map(res.data.data, sample => {
				return values(pick(sample, ["id", "name", "species", "description", "ingroups", "numseqs"]));
			});
			this.setState({ samples, total: res.data.total });
		});
	}

	render() {
		const { page, total, rowsPerPage, samples } = this.state;
		const options = {
			pagination: true,
			viewColumns: false,
			selectableRows: false,
			filter: false,
			rowsPerPageOptions: [ 50, 100, 200 ],
			rowsPerPage: rowsPerPage,
			page: page,
			count: total,
			serverSide: true,
			onTableChange: (action, tableState) => {
				if(tableState.page !== page || tableState.rowsPerPage !== rowsPerPage){
					this.setState({ page: tableState.page, 
									rowsPerPage: tableState.rowsPerPage}, () => {
						this.getData();
					});
				}
			},
			onColumnSortChange: (changedColumn, direction) => {
				var col = changedColumn.replace("Sample Name", "name")
										.replace("Species", "species")
										.replace("In groups/assemblies", "ingroups")
										.replace("Num. sequences", "numseqs");
				var dir = direction.replace(/(asc|desc)ending/, "$1");
				this.setState({ orderby: `${col} ${dir}`,
								page: 0}, () => {
					this.getData();
				});
			}
		};
		const columns = [
			{ name:"dbID", options: {display: 'excluded'} }, 
			{ name:"Sample Name", options: {sort: true} },  
			{ name:"Species", options: {sort: true} }, 
			{ name:"Description", options: {sort: false} }, 
			{ name:"In groups/assemblies",  options: { 
					sort: true,
					customBodyRender: (value, tableMeta, updateValue) => {
						return (value.toLocaleString())
					} 
				}
			}, 
			{ name:"Num. sequences", options: { 
					sort: true,
					customBodyRender: (value, tableMeta, updateValue) => {
						return (value.toLocaleString())
					} 
				} 
			}];
		return (
			<div>
				<MuiDataTable
					data={samples}
					columns={columns}
					options={options}
					title={"Samples"}
				/>
			</div>
		);
	}
}

export default ListSamples;
