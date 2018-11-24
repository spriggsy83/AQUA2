import React, { Component } from "react";
import axios from "axios";
import MuiDataTable from "mui-datatables";
import { map, pick, values } from "lodash";

const apiBaseUrl = "http://localhost:4000/api/v1";

class ListSamples extends Component {
	state = {
		samples: []
	};

	componentDidMount() {
		axios.get(`${apiBaseUrl}/samples`).then(res => {
			const samples = map(res.data.data, sample => {
				return values(pick(sample, ["name", "species", "description"]));
			});
			this.setState({ samples });
		});
	}

	render() {
		const options = {
			pagination: false,
			rowsPerPage: 50,
			viewColumns: false,
			selectableRows: false,
			filter: false
		};
		const columns = ["Sample Name", "Species", "Description"];
		console.log(this.state.samples);
		return (
			<div>
				<MuiDataTable
					data={this.state.samples}
					columns={columns}
					options={options}
					title={"Samples"}
				/>
			</div>
		);
	}
}

export default ListSamples;
