import React, { Component } from "react";
import Cell from "./Cell";



class Grid extends Component {
  frameTranslate(frame) {
    
    
  }

  render() {
    const { frame, handleAgent, handleObstacle } = this.props
    
    const grid = frame.map((row, x) => {
      const rowItems = row.map((cell, y) => {
        return <Cell 
          key={y} 
          x={x} 
          y={y} 
          color={cell.color}
          type={cell.type}
          handleAgent={handleAgent}
          handleObstacle={handleObstacle}></Cell>
      })
      
      const rowDiv = <div key={x} className="row">{rowItems}</div>
      return rowDiv
    })

    return grid
  }
}

export default Grid;
