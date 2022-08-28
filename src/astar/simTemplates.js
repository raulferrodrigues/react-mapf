import { Graph } from "./astar"

function example1() {
  const tenGrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  ]
  
  const graph10 = new Graph(tenGrid)
  graph10.nodes[2].weight = 0

  const object = {
    graphSize: 10,
    graph: graph10,
    agents: [
      {
        id: crypto.randomUUID(),
        color: "green",
        priority: 1,
        start: graph10.grid[0][0],
        end: graph10.grid[0][9]
      },
      {
        id: crypto.randomUUID(),
        color: "red",
        priority: 2,
        start: graph10.grid[0][9],
        end: graph10.grid[0][0]
      },
    ]
  }

  return object
}



export { example1 }