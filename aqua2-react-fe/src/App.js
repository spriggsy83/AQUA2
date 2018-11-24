import React, { Component } from "react";
import NavBar from "./components/NavBar";
import ListSamples from "./components/Samples";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <ListSamples />
      </div>
    );
  }
}

export default App;
