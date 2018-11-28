import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MuiDataTable from "mui-datatables";
import API from '../API';
import { map, pick, values } from "lodash";

const localtheme = createMuiTheme({
	typography: {
		useNextVariants: true,
	},
});	

class ListSequences extends Component {

	state = {
		page: 0,
		total: 0,
		rowsPerPage: 20,
		orderby: null,
		sequences: []
	};

	componentDidMount() {
		this.getData();
	}

	// Get initial data
	getData = () => {
		const { page, rowsPerPage, orderby } = this.state;
		const offset = page*rowsPerPage;
		API.get(`sequences?limit=${rowsPerPage}&offset=${offset}&sort=${orderby}`).then(res => {
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
				if(tableState.page !== page || tableState.rowsPerPage !== rowsPerPage){
					this.setState({ page: tableState.page, 
									rowsPerPage: tableState.rowsPerPage}, () => {
						this.getData();
					});
				}
			},
			onColumnSortChange: (changedColumn, direction) => {
				var col = changedColumn.replace("Name", "name")
										.replace("Length (bp)", "length")
										.replace("Group", "groupName")
										.replace("Sample", "sampleName")
										.replace("Type", "typeName");
				var dir = direction.replace(/(asc|desc)ending/, "$1");
				this.setState({ orderby: `${col} ${dir}`,
								page: 0}, () => {
					this.getData();
				});
			}
		};
		const columns = [
			{ name:"dbID", options: {display: 'excluded'} },
			{ name:"Name", options: {sort: true} }, 
			{ name:"Length (bp)", options: { 
					sort: true,
					customBodyRender: (value, tableMeta, updateValue) => {
						return (value.toLocaleString())
					} 
			} }, 
			{ name:"groupId", options: {display: 'excluded'} },
			{ name:"Group", options: {sort: true} }, 
			{ name:"sampleId", options: {display: 'excluded'} }, 
			{ name:"Sample", options: {sort: true} }, 
			{ name:"typeId", options: {display: 'excluded'} }, 
			{ name:"Type", options: {sort: true} }, 
			{ name:"Annotation note", options: {sort: false} }, 
			{ name:"External link", options: { 
					sort: false,
					customBodyRender: (value, tableMeta, updateValue) => {
						if(value)
							return (<a href={value} target="_blank" rel="noopener noreferrer">link</a>)
						else
							return;
					} 
				} }, 
			];
		return (
			<div>
				<MuiThemeProvider theme={localtheme}>
				<MuiDataTable
					data={sequences}
					columns={columns}
					options={options}
					title={"Sequences"}
				/>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default ListSequences;
