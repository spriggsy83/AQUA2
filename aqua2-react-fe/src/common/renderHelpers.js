import React, { Component } from "react";
import NumberFormat from "react-number-format";
import LinearProgress from "@material-ui/core/LinearProgress";
import BuildIcon from "@material-ui/icons/Build";
import Typography from "@material-ui/core/Typography";

export class UnderConstruction extends Component {
	render() {
		return (
			<>
				<Typography variant="h6" color="inherit" noWrap>
					Under Construction
				</Typography>
				<BuildIcon />
			</>
		);
	}
}

export function renderNumber(value) {
	return (
		<NumberFormat
			value={value}
			displayType={"text"}
			thousandSeparator={true}
			style={{ float: "right" }}
		/>
	);
}

export function renderLoadingBars() {
	return (
		<>
			<LinearProgress />
			<br />
			<LinearProgress color="secondary" />
		</>
	);
}
