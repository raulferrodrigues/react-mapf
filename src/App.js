import React, { Component } from "react";
import { test, graph, graphSize, digest, video } from "./astar/mapf"

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { frame: [] }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {
    this.frames = video()
    this.frameCount = 0
    
    this.setState({
      frame: this.frames[0]
    })

    this.interval = setInterval(() => this.tick(), 200)
  }
  
  tick() {
    if (this.frameCount < this.frames.length - 1) {
      this.frameCount++

      this.setState({
        frame: this.frames[this.frameCount],
        frameCount: this.frameCount
      })
    } else {

      this.setState({
        frame: this.frames[this.frames.length - 1],
        frameCount: this.frameCount
      })
      
      clearInterval(this.interval)
    }    
  }

  grid() {
    console.debug("state", this.state)
    let count = 0

    const listItems = this.state.frame.map((row) => {
      const rowItems = row.map((cell) => {
        count++ 
        return <span className={cell} key={count}></span>
      })
      const rowDiv = <div className="row">{rowItems}</div>
      return rowDiv
    })

    return listItems
  }

  render() {
    return (
      <div className="grid">
        {this.grid()}
      </div>
    );
  }
}

export default App;
