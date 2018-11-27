import React, { Component } from "react";
//import axios from "axios";
import API from '../API';
import MuiDataTable from "mui-datatables";
import { map, pick, values } from "lodash";

class ListSamples extends Component {
	state = {
		page: 0,
		total: 0,
		rowsPerPage: 5,
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
			rowsPerPageOptions: [ 10, 50, 100 ],
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
			{ name:"dbID", options: {display: false} }, 
			"Sample Name", 
			"Species", 
			"Description", 
			{ name:"In groups/assemblies",  options: { 
					customBodyRender: (value, tableMeta, updateValue) => {
						return (value.toLocaleString())
					} 
				}
			}, 
			{ name:"Num. sequences", options: { 
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
