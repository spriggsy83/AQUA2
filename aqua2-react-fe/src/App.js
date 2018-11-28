import React, { Component } from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import NavBar from "./components/NavBar";
import ListSamples from "./components/Samples";
import ListSequences from "./components/Sequences";
import "./App.css";

const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
	},
});

class App extends Component {
	render() {
	return (
		<React.Fragment>
		<MuiThemeProvider theme={theme}>
		<NavBar />
		<Router>
			<Switch>
				<Route path='/samples' component={ListSamples}/>
				<Route path='/sequences' component={ListSequences}/>
			</Switch>
		</Router>
		</MuiThemeProvider>
		</React.Fragment>
		);
	}
}

export default App;
