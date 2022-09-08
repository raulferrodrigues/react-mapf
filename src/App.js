import React, { Component } from "react";
import { toyGrid } from "./astar/examples/grids";
import { createNewSim, toySim } from "./astar/mapf"

const Mode = {
  idle: 0,
  running: 1,
  creation: 2,
  agentStartSelected: 3,
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: Mode.creation,
      agents: [],
      grid: toyGrid,
      frame: [
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
        ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',],
      ],
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {
    
  }
  
  tick() {
    if (this.frameCount < this.videoFrames.length - 1) {
      this.frameCount++

      this.setState({
        frame: this.videoFrames[this.frameCount],
        frameCount: this.frameCount
      })
    } else {

      this.setState({
        frame: this.videoFrames[this.videoFrames.length - 1],
        frameCount: this.frameCount
      })
      
      clearInterval(this.interval)
    }    
  }

  grid() {
    const listItems = this.state.frame.map((row, x) => {
      const rowItems = row.map((cell, y) => {
        return <span style={{backgroundColor: this.state.grid[x][y] === 0 ? "gray" : cell}} className={'cell'} key={y} onClick={((e) => this.handleCellClick(e, x, y))} onContextMenu={(e) => this.handleCellClick(e, x, y)}></span>
      })

      const rowDiv = <div key={x} className="row">{rowItems}</div>
      return rowDiv
    })

    return listItems
  }

  handleCellClick(e, x, y) {
    e.preventDefault()
    
    if (e.nativeEvent.which === 1) {
      if (this.state.grid[x][y] === 0) {
        return
      }
      if (this.state.mode === Mode.creation) {
        this.currentColor = '#' + Math.floor(Math.random()*16777215).toString(16)
        let grid = this.state.frame
        grid[x][y] = this.currentColor 
  
        this.setState({ frame: grid, agentStart: { x, y }, mode: Mode.agentStartSelected })
      }
  
      
  
      if (this.state.mode === Mode.agentStartSelected) {
        const agent = {
          color: this.currentColor,
          startPoint: this.state.agentStart,
          endPoint: { x, y },
        }
  
        
        let agents = this.state.agents
        agents.push(agent)
  
        this.setState({ ...this.state, agents, mode: Mode.creation })
      }
    } else if (e.nativeEvent.which === 3) {
      if (this.state.grid[x][y] === 1) {
        let grid = this.state.grid
        grid[x][y] = 0
        this.setState({ grid })
      } else {
        let grid = this.state.grid
        grid[x][y] = 1
        this.setState({ grid })
      }
    }
  }

  handleHeyo() {
    this.videoFrames = toySim()

    this.frameCount = 0
    this.setState({
      frame: this.videoFrames[0]
    })

    clearInterval(this.interval)
    this.interval = setInterval(() => this.tick(), 200)
  }

  handleCreateNewSim() {
    const settings = {
      grid: this.state.grid,
      agents: this.state.agents
    }

    this.videoFrames = createNewSim(settings)
    this.frameCount = 0
    this.setState({
      frame: this.videoFrames[0]
    })

    this.interval = setInterval(() => this.tick(), 200)
  }

  handleRestartClick() {
    this.frameCount = 0
    this.setState({
      frame: this.videoFrames[0]
    })

    clearInterval(this.interval)
    this.interval = setInterval(() => this.tick(), 1000)
  }

  render() {
    return (
      <div key='top'>
        <div key='grid' className="grid">
          {this.grid()}
        </div>
        <button key='start' onClick={() => this.handleHeyo()}>heyo</button>
        <button key='create' onClick={() => this.handleCreateNewSim()}>Create new map</button>
        <button key='restart' onClick={() => this.handleRestartClick()}>Restart</button>
      </div>
    );
  }
}

export default App;
