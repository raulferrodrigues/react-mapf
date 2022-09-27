import React, { Component } from "react";
import axios from "axios";
import { toyGrid } from "./astar/examples/grids";
import { createNewSim, toySim } from "./astar/mapf";

const Mode = {
  idle: 0,
  running: 1,
  creation: 2,
  agentStartSelected: 3,
}

const tick = 200

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
    console.log('before', this.state.agents)

    e.preventDefault()
    
    if (e.nativeEvent.which === 1) {
      if (this.state.grid[x][y] === 0) {
        return
      }

      const index = this.state.agents.findIndex(agent => agent.startPoint.x === x && agent.startPoint.y === y)

      if (index !== -1) {
        return
        // let agents = this.state.agents
        // agents.splice(index, 1)
        // this.setState({ agents })
      } else {
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

  handlerReset() {
    this.frameCount = 0
    this.setState({
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
    })

    clearInterval(this.interval)
  }

  handleRun() {
    const settings = {
      grid: this.state.grid,
      agents: this.state.agents
    }

    this.videoFrames = createNewSim(settings)
    this.frameCount = 0
    this.setState({
      frame: this.videoFrames[0]
    })

    this.interval = setInterval(() => this.tick(), tick)
  }

  handleRestartClick() {
    this.frameCount = 0
    this.setState({
      frame: this.videoFrames[0]
    })

    clearInterval(this.interval)
    this.interval = setInterval(() => this.tick(), tick)
  }

  handleCbs() {
    const payload = {
      "agents": [],
      "map": {
        "dimensions": [10, 10],
        "obstacles": []
      }
    }

    this.state.agents.forEach(agent => {
      payload.agents.push({
        "start": [agent.startPoint.x, agent.startPoint.y],
        "goal": [agent.endPoint.x, agent.endPoint.y],
        "name": agent.color
      })
    })

    this.state.grid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          payload.map.obstacles.push([rowIndex, cellIndex])
        }
      })
    })

    fetch("http://localhost:8080", {
      credentials: 'omit',
      method: "POST",
      body: JSON.stringify(payload),
      mode: 'cors'
    })
    .then((res) => res.json())
    .then((data) => { console.log(data) })
    .catch((res) => { console.log(res) })
  }

  render() {
    return (
      <div key='top'>
        <div key='grid' className="grid">
          {this.grid()}
        </div>
        <button key='naive' onClick={() => this.handleRun()}>Run Naive Search</button>
        <button key='cbs' onClick={() => this.handleCbs()}>Run CBS</button>
        <button key='restart' onClick={() => this.handleRestartClick()}>Restart</button>
        <button key='reset' onClick={() => this.handlerReset()}>Reset</button>
      </div>
    );
  }
}

export default App;
