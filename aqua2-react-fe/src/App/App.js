import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../common/theme";
import { MainMenu } from "../MainMenu";
import { ListTotals } from "../Totals";
import { ListSamples } from "../Samples";
import { ListSeqTypes } from "../SeqTypes";
import { ListSeqGroups } from "../SeqGroups";
import { ListSequences } from "../Sequences";
import { SeqDetail } from "../OneSeq";
import { SearchResultList } from "../Search";
import "./App.css";

import { UnderConstruction } from "../common/renderHelpers";

class App extends Component {
	routeList = () => {
		return (
			<Switch>
				<Route exact path="/" component={ListTotals} />
				<Route path="/Samples/:sample_id" component={UnderConstruction} />
				<Route path="/Samples" component={ListSamples} />
				<Route path="/SeqTypes/:seqtype_id" component={UnderConstruction} />
				<Route path="/SeqTypes" component={ListSeqTypes} />
				<Route path="/SeqGroups/:seqgroup_id" component={UnderConstruction} />
				<Route path="/SeqGroups" component={ListSeqGroups} />
				<Route path="/Sequences/:sequence_name" component={SeqDetail} />
				<Route path="/Sequences" component={ListSequences} />
				<Route path="/BulkAnnot" component={UnderConstruction} />
				<Route path="/Search" component={SearchResultList} />
			</Switch>
		);
	};

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Router>
					<MainMenu>{this.routeList()}</MainMenu>
				</Router>
			</MuiThemeProvider>
		);
	}
}

export default App;
