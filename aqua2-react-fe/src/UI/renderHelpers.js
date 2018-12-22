import React from "react";
import NumberFormat from "react-number-format";
import LinearProgress from "@material-ui/core/LinearProgress";

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
