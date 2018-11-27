import React, { Component } from "react";
import NavBar from "./components/NavBar";
import ListSamples from "./components/Samples";
import ListSequences from "./components/Sequences";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <ListSequences />
      </div>
    );
  }
}

export default App;
