import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./UI/theme";
import NavBar from "./components/NavBar";
import ListSamples from "./components/Samples";
import ListSequences from "./components/Sequences";
import "./App.css";

class App extends Component {
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<NavBar />
				<Router>
					<Switch>
						<Route path="/samples" component={ListSamples} />
						<Route path="/sequences" component={ListSequences} />
					</Switch>
				</Router>
			</MuiThemeProvider>
		);
	}
}

export default App;
