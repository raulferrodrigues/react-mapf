import React, { Component } from "react";
import { test, graph } from "./astar/mapf"


class App extends Component {

  constructor(props) {
    let agents = test()
    super(props)

    this.agents = agents
  } 

  state = {
    
  };



  
  render() {
    return (
      <div className="table">
        {graph.grid.map((row) => {
          
          row.map((node) => {
            console.debug("aqui")
            return <div>oi</div>
          })
        })}
      </div>
    );
  }
}

export default App;
