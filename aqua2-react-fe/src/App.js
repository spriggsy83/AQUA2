import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./UI/theme";
import MainMenu from "./components/MainMenu";
import ListTotals from "./components/Totals";
import ListSamples from "./components/Samples";
import ListSequences from "./components/Sequences";
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
