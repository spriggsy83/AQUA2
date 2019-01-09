import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "common/theme";
import { MainMenu } from "Main";
import { ListTotals } from "Totals";
import { ListSamples } from "Samples";
import { ListSeqTypes } from "SeqTypes";
import { ListSeqGroups } from "SeqGroups";
import { ListSequences } from "Sequences";
import "./App.css";

class App extends Component {
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Router>
					<MainMenu>
						<Switch>
							<Route exact path="/" component={ListTotals} />
							<Route path="/Samples" component={ListSamples} />
							<Route path="/SeqTypes" component={ListSeqTypes} />
							<Route
								path="/SeqGroups"
								component={ListSeqGroups}
							/>
							<Route
								path="/Sequences"
								component={ListSequences}
							/>
						</Switch>
					</MainMenu>
				</Router>
			</MuiThemeProvider>
		);
	}
}

export default App;
