import React, { Component } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SubseqSlider from "./SubseqSlider";

class AnnotTabViewer extends Component {
	render() {
		return (
			<>
				<ExpansionPanel>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Annotations table</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<SubseqSlider
							subseqStart={100}
							subseqEnd={5000}
							seqLength={10000}
						/>
						<Typography>Annotations here</Typography>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</>
		);
	}
}

export default AnnotTabViewer;
