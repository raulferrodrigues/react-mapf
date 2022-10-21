import React, { Component } from "react";
import { CellType } from "../Aux";


const styles = {
  cell: {
    backgroundColor: 'black',
    width: '50px',
    height: '50px',
    margin: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  circle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  endDot: {
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    backgroundColor: 'dimgrey'
  },
}

class Cell extends Component {
  start() {
    const { x, y, color, handleAgent, handleObstacle } = this.props

    return <span 
      style={ styles.cell } 
      onClick={() => handleAgent(x, y)} 
      onContextMenu={() => handleObstacle(x, y)}>
      <div style={{ ...styles.circle, backgroundColor: color }}></div>
    </span>
  }
  
  end() {
    const { x, y, color, handleAgent, handleObstacle } = this.props

    return <span 
      style={ styles.cell } 
      onClick={() => handleAgent(x, y)} 
      onContextMenu={() => handleObstacle(x, y)}>
      <div style={{ ...styles.circle, backgroundColor: color }}>
        <div style={styles.endDot}></div>
      </div>
    </span>
  }

  obstacle() {
    const { x, y, handleAgent, handleObstacle } = this.props

    return <span 
      style={{ ...styles.cell, backgroundColor: 'dimgrey' }}
      onClick={() => handleAgent(x, y)}
      onContextMenu={() => handleObstacle(x, y)}>
    </span>
  }

  empty() {
    const { x, y, handleAgent, handleObstacle } = this.props

    return <span 
      style={ styles.cell }
      onClick={() => handleAgent(x, y)}
      onContextMenu={() => handleObstacle(x, y)}>
    </span>
  }

  render() {
    if (this.props.type === CellType.start)    { return this.start() }
    if (this.props.type === CellType.end)      { return this.end() }
    if (this.props.type === CellType.obstacle) { return this.obstacle() }
    return this.empty()
  }
}

export default Cell;