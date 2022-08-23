import { astar, Graph } from "./astar.js";
import { ten } from "./graph.js";

/*
  DECISOES:
    - numero de objetivos <= a numero de agentes
    - distribuir aleatoriamente os objetivos
    - 
*/

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

- o que fazer quando um agente está parado e bloquendo o objetivo do outro
*/

const graph = new Graph(ten)

function test() {
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

  sim(agents)

  return(agents)
}

function sim(agentsWithPaths) {
  let continueFlag = true
  let step = 0

  while (continueFlag) {
    continueFlag = false
    let locations = []

    for (let agent of agentsWithPaths) {
      if (step < agent.path.length) {
        continueFlag = true

        locations.push({
          id: agent.id,
          position: {
            x: agent.path[step].x,
            y: agent.path[step].y
          }
        })
      }
    }

    if (conflict(locations)) {
      console.debug("conflict", locations)
    }

    step++
  }
}

function conflict(agentLocations) {
  console.debug("agentLocations", agentLocations)

  for (let agent of agentLocations) {
    for (let otherAgent of agentLocations) {
      if (agent.id !== otherAgent.id) {
        observe(agent, otherAgent)
      }
    }
  }
}

function observe(agentA, agentB) {
  // north
  if (  agentB.position.y === agentA.position.y - 1 &&
        agentB.position.x === agentA.position.x
  ) { return 1 }

  // south
  if (  agentB.position.y === agentA.position.y + 1 && 
        agentB.position.x === agentA.position.x
  ) { return 1 }

  // west
  if (  agentB.position.y === agentA.position.y &&
        agentB.position.x === agentA.position.x - 1
  ) { return 1 }

  // east
  if (  agentB.position.y === agentA.position.y &&
        agentB.position.x === agentA.position.x + 1
  ) { return 1 }
}

export { test, graph };
