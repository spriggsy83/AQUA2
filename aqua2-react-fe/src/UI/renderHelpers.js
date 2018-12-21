import React from "react";
import NumberFormat from "react-number-format";

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
