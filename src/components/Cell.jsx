import React, { Component } from "react";

const style = {
  width: '30px',
  height: '30px',
  margin: '5px'
}

class Cell extends Component {
  render() {
    const { color, x, y, handleAgent, handleObstacle } = this.props
    const span = <span 
      style={{ ...style, backgroundColor: color }} 
      onClick={() => handleAgent(x, y)} 
      onContextMenu={() => handleObstacle(x, y)}>
      <div>
        
      </div>
    </span>
    
    return span
  }
}

export default Cell;
