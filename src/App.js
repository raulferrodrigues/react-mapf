import deepcopy from "deepcopy";
import React, { Component } from "react";
import { emptyGrid } from "./astar/examples/grids";
import { createNewSim, videoCBS } from "./astar/mapf";
import { colors, emptyFrame, CellType } from "./Aux";
import Grid from "./components/Grid";

const tick = 500

const Mode = {
  idle: 0,
  running: 1,
  creation: 2,
  agentStartSelected: 3,
}

const cleanSettings = {
  mode: Mode.creation,
  frame: emptyFrame,
  grid: emptyGrid,
  agents: [],
  obstacles: [],
  video: [],
  frameCount: 0
}

class App extends Component {

  constructor(props) {
    super(props)

    this.mode = Mode.creation
    this.grid = emptyGrid
    this.currentAgent = null
    this.agents = []
    this.obstacles = []
    this.video = []
    this.frameCount = 0

    this.state = cleanSettings

    document.addEventListener("contextmenu", (event) => { event.preventDefault() })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {

  }

  tick() {
    console.debug(this.frameCount)

    if (this.frameCount < this.video.length - 1) {
      this.frameCount++

      this.setState({
        frame: this.video[this.frameCount],
      })
    } else {
      this.setState({
        frame: this.video[this.video.length - 1]
      })

      clearInterval(this.interval)
    }
  }

  buildFrame() {    
    const frame = deepcopy(emptyFrame)

    if (this.currentAgent) {
      const { color, startPoint } = this.currentAgent
      frame[startPoint.x][startPoint.y] = { type: CellType.start, color: color }
    }

    this.agents.forEach(agent => {
      const { startPoint, endPoint, color } = agent
      frame[startPoint.x][startPoint.y] = { type: CellType.start, color: color }
      frame[endPoint.x][endPoint.y] = { type: CellType.end, color: color }
    })

    this.obstacles.forEach(obstacle => {
      frame[obstacle.x][obstacle.y] = { type: CellType.obstacle, color: 'dimgrey' }
    })

    this.setState({ frame })
  }

  handleAgent(x, y) {
    if (this.obstacles.filter(e => e.x === x && e.y === y).length !== 0) return
    if (this.agents.filter(e => e.startPoint.x === x && e.startPoint.y === y).length !== 0) return
    if (this.agents.filter(e => e.endPoint.x === x && e.endPoint.y === y).length !== 0) return

    if (this.mode === Mode.creation) {
        this.mode = Mode.agentStartSelected
        this.currentAgent = { 
          color: colors[Math.floor(Math.random() * colors.length)],
          startPoint: { x, y }
        }
    } else

    if (this.mode === Mode.agentStartSelected) {
      const agent = {
        ...this.currentAgent,
        endPoint: { x, y },
      }
      
      this.agents.push(agent)
      this.mode = Mode.creation
      this.currentAgent = null
    }

    console.debug(this.agents)
    this.buildFrame()
  }

  handleObstacle(x, y) {
    console.debug(x, y)

    if (this.obstacles.filter(e => e.x === x && e.y === y).length !== 0)

      this.obstacles = this.obstacles.filter(e => e.x !== x || e.y !== y)
    else
      this.obstacles.push({ x, y })

    this.buildFrame()
  }

  handlerReset() {
    this.frameCount = 0
    this.setState(cleanSettings)

    clearInterval(this.interval)
  }

  handleRun() {
    const grid = deepcopy(emptyGrid)

    this.obstacles.forEach(obstacle => {
      grid[obstacle.x][obstacle.y] = 0
    })

    const settings = {
      grid: grid,
      agents: this.agents
    }

    this.video = createNewSim(settings)
    this.frameCount = 0

    this.setState({ frame: this.video[0] })

    this.interval = setInterval(() => this.tick(), tick)
  }

  handleRestartClick() {
    clearInterval(this.interval)

    this.frameCount = 0
    this.setState({ frame: this.video[0] })

    this.interval = setInterval(() => this.tick(), tick)
  }

  // handleCbs() {
  //   const payload = {
  //     "agents": [],
  //     "map": {
  //       "dimensions": [10, 10],
  //       "obstacles": []
  //     }
  //   }

  //   this.state.agents.forEach(agent => {
  //     payload.agents.push({
  //       "start": [agent.startPoint.x, agent.startPoint.y],
  //       "goal": [agent.endPoint.x, agent.endPoint.y],
  //       "name": agent.color
  //     })
  //   })

  //   this.state.grid.forEach((row, rowIndex) => {
  //     row.forEach((cell, cellIndex) => {
  //       if (cell === 0) {
  //         payload.map.obstacles.push([rowIndex, cellIndex])
  //       }
  //     })
  //   })

  //   fetch("http://localhost:8080", {
  //     credentials: 'omit',
  //     method: "POST",
  //     body: JSON.stringify(payload),
  //     mode: 'cors'
  //   })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.debug("heyo heyo")
  //     this.pythonTranslate(data)
  //   })
  //   .catch((res) => { console.log(res) })
  // }

  // pythonTranslate(data) {

  //   console.debug(videoCBS(data, this.state.grid))

  //   this.videoFrames = videoCBS(data, this.state.grid)
  //   this.frameCount = 0
  //   this.setState({
  //     frame: this.videoFrames[0]
  //   })

  //   this.interval = setInterval(() => this.tick(), tick)
  // }

  render() {
    return (
      <div key='canvas'>
        <div key='topbar'>
          <label className="switch">
            <input type="checkbox"></input>
            <span className="slider round"></span>
          </label>
        </div>

        <Grid 
          key='grid'
          frame={this.state.frame} 
          handleAgent={this.handleAgent.bind(this)} 
          handleObstacle={this.handleObstacle.bind(this)}></Grid>

        <button key='run-naive' onClick={() => this.handleRun()}>Run Naive Search</button>
        {/* <button key='cbs' onClick={() => this.handleCbs()}>Run CBS</button> */}
        <button key='restart' onClick={() => this.handleRestartClick()}>Restart</button>
        <button key='reset' onClick={() => this.handlerReset()}>Reset</button>
      </div>
    );
  }
}

export default App;
