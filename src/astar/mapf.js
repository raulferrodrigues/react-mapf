import { astar, Graph } from "./astar.js";
import { ten } from "./graph.js";

/* 
- ve essa historia de CBS

- implementar um sistema de grid
  - como ta agora é so um negocio de const

- criar sistema de simulaçao
  - esquema de pop dos paths dos agentes
  - quando houver colisao (dois agentes proximos) tratar
  - criar digest da simulçao para fazer animação no final

- colocar mais de um agente
  - testar colisao
*/



function test() {
  const graph = new Graph(ten)

  const agents = [
    {
      id: crypto.randomUUID(),
      start: graph.grid[0][0],
      end: graph.grid[9][9]
    },
    {
      id: crypto.randomUUID(),
      start: graph.grid[0][9],
      end: graph.grid[9][0]
    },
  ]

  for (let agent of agents) {
    const path = astar.search(graph, agent.start, agent.end, undefined)
    agent.path = path
  }

  for (let step of agents[0].path) {
    console.debug(step)
  }
  

  sim(agents)
}

function sim(agentsWithPaths) {
  let continueFlag = true
  let step = 0

  while (continueFlag) {
    let locations = []
    for (let agent of agentsWithPaths) {
      if (step < agent.path.length) {
        continueFlag = true

        locations.push({
          agentId: agent.id,
          position: {
            x: agent.path[step].x,
            y: agent.path[step].y
          }
        })
      }
    }
  }
}

// function conflict(agentLocations) {
//   for (let agent of agentLocations) {

//   }
// }

export { test };
