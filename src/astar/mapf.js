/* eslint-disable no-unused-expressions */
import { astar, Graph } from './astar.js';
import { toySettings } from './examples/simSettings.js';
import * as deepcopy from 'deepcopy';
import { map } from 'jquery';

/*
  DECISOES:
    - numero de objetivos <= a numero de agentes
    - distribuir aleatoriamente os objetivos
    - 
*/

/* 
- NAO TEM PROBLEMA DE DEADLOCK. PORQUE:
  - porque temos uma ordem uni-direcional de prioridade
  - prioridade decrescente (o agente com o maior numero é o mais importante e assim é o que continua se movendo. o outro para.)

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

/*
const settings = example1()

const graphSize = settings.graphSize
const graph = settings.graph
const agents = settings.agents
*/

/*
function test() {
  graph.nodes[2].weight = 0

  for (let agent of agents) {
    console.debug(agent.start, agent.end)
    let path = []
    path.push(agent.start)
    path.push(...astar.search(graph, agent.start, agent.end, undefined))
    
    agent.path = path
  }

  sim(agents)

  return agents
}
*/

function toySim() {
  return createNewSim(toySettings)
}

function createNewSim(settings) {
  const graph = new Graph(settings.grid)

  let priority = 0
  let agents = []

  for (let agent of settings.agents) {
    priority++

    const ag = {
      id: crypto.randomUUID(),
      color: agent.color,
      priority: priority,
      start: graph.grid[agent.startPoint.x][agent.startPoint.y],
      end: graph.grid[agent.endPoint.x][agent.endPoint.y]
    }

    // Roda a simulação
    let path = []
    path.push(ag.start)
    path.push(...astar.search(graph, ag.start, ag.end, undefined))
    ag.path = pathing(ag, graph)
    agents.push(ag)
  }

  // Agentes com os caminhos
  collisionAvoidance(agents, graph)

  return video(agents, graph)
}

function video(agents, graph) {
  // // Roda a simulação
  // for (let agent of agents) {
  //   // console.debug(agent.start, agent.end)
  //   let path = []
  //   path.push(agent.start)
  //   path.push(...astar.search(graph, agent.start, agent.end, undefined))

  //   agent.path = path
  // }

  // // Agentes com os caminhos
  // let agentsWithPaths = collisionAvoidance(agents)

  let frames = []
  let initialFrame = []

  frames.push(initialFrame)

  // Produz of frame inicial
  for (let x = 0; x < graph.grid.length; x++) {
    let column = []
    for (let y = 0; y < graph.grid.length; y++) {
      column.push('black')
    }
    initialFrame.push(column)
  }

  // Estruturas para produzir o video
  let continueFlag = true
  let step = 0
  let lastFrame = deepcopy(initialFrame)



  // Produz o video
  while (continueFlag) {
    continueFlag = false
    let newFrame = deepcopy(initialFrame)

    for (let agent of agents) {

      if (step < agent.path.length) {
        continueFlag = true

        // fazer novo frame
        newFrame[agent.path[step].x][agent.path[step].y] = agent.color
      }
    }

    frames.push(newFrame)
    lastFrame = newFrame

    step++
  }

  return frames
}

function pathing(agent, graph) {
  // TODO: higiene dos parametros

  let path = []
  path.push(agent.start)
  path.push(...astar.search(graph, agent.start, agent.end, undefined))

  return path
}


function collisionAvoidance(agentsparam, graphparam) {
  // Param hygiene
  const agents = deepcopy(agentsparam)
  const graph = deepcopy(graphparam)
  // ...

  let continueFlag = true
  let step = 0

  while (continueFlag) {
    continueFlag = false

    // Check if all agents have reached their destination. If not then set continueFlag to true and keep running the simulation.
    agents.forEach((agent) => {
      if (step < agent.path.length) { continueFlag = true }
    })

    if (continueFlag) {
      const agentsWithCollisions = testCollisions(agents, step)
      if (agentsWithCollisions.length !== 0) {
      }

    }


    //   for (let collision of agentsWithCollisions) {
    //     let collisionNode
    //     let previousCollisionNodeWeight

    //     let highPriorityAgent
    //     let lowPriorityAgent

    //     console.debug(collision)

    //     for (let collision of collision.collion)



    //     // Se a prioridade of agent foi maior que a do otherAgent, pausamos o otherAgent
    //     if (collision.agent.agent.priority > collision.otherAgent.agent.priority) {
    //       highPriorityAgent = collision.agent.agent
    //       lowPriorityAgent = collision.otherAgent.agent
    //     } else {
    //       highPriorityAgent = collision.otherAgent.agent
    //       lowPriorityAgent = collision.agent.agent
    //     }

    //     const bubble = lowPriorityAgent.path[step]
    //     lowPriorityAgent.path.splice(step + 1, 0, bubble)

    //     collisionNode = getNode(bubble.x, bubble.y, graph)
    //     previousCollisionNodeWeight = collisionNode.weight
    //     collisionNode.weight = 0

    //     highPriorityAgent.path.length = step + 1
    //     let newPathSegment = []
    //     newPathSegment.push(...astar.search(graph, highPriorityAgent.path[step], highPriorityAgent.end, undefined))
    //     highPriorityAgent.path.push(...newPathSegment)

    //     collisionNode.weight = previousCollisionNodeWeight
    //   }
    

    step++
  }
}

function testCollisions(agents, step) {
  let agentsWithCollisions = []

  // Para cada agente
  // for (let agentWithLocation of agentLocationPairs) {
  for (let agent of agents) {
    const collisions = agents
      .filter(ag => ag !== agent)
      .map(otherAgent => {
        const observation = observe(agent.path[step], otherAgent.path[step])
        if (observation) { return otherAgent }
      })

    // Pareando com todos os agentes

    // for (let otherAgentWithLocation of agentLocationPairs) {
    //   // Se os dois agentes sendo pareados forem difirentes
    //   if (agentWithLocation.agent.id !== otherAgentWithLocation.agent.id) {
    //     // Faz os testes de conflito
    //     const observed = observe(agentWithLocation, otherAgentWithLocation)


    //     // Se houver conflitos
    //     if (observed === 1) {

    //       let skip = false
    //       // Tenta não colocar conflitos do tipo A | B se ja tem B | A
    //       for (let collision of otherAgentWithLocation.collisions) {
    //         if (collision.agent === otherAgentWithLocation && collision.otherAgent === agentWithLocation) {
    //           skip = true
    //         }
    //       }

    //       // Nao coloca duplicatas
    //       if (!skip) {
    //         agentsWithConflicts.push(otherAgentWithLocation)
    //       }

    //       collisions.push(otherAgentWithLocation)
    //     }
    //   }
    // }

    // if (collisions.length > 0) {
    //   agentsWithCollisions.push({ agent, collisions })
    // }
  }

  return agentsWithCollisions
}

function observe(agentA, agentB) {
  // north
  if (agentB.y === agentA.y &&
    agentB.x === agentA.x + 1
  ) { return 'north' }

  // south
  if (agentB.y === agentA.y &&
    agentB.x === agentA.x - 1
  ) { return 'south' }

  // east
  if (agentB.y === agentA.y + 1 &&
    agentB.x === agentA.x
  ) { return 'east' }

  // west
  if (agentB.y === agentA.y - 1 &&
    agentB.x === agentA.x
  ) { return 'west' }

  // northeast
  if (agentB.y === agentA.y + 1 &&
    agentB.x === agentA.x + 1
  ) { return 'northeast' }

  // northwest
  if (agentB.y === agentA.y - 1 &&
    agentB.x === agentA.x + 1
  ) { return 'northwest' }

  // southeast
  if (agentB.y === agentA.y + 1 &&
    agentB.x === agentA.x - 1
  ) { return 'southeast' }

  // southwest
  if (agentB.y === agentA.y - 1 &&
    agentB.x === agentA.x - 1
  ) { return 'southwest' }

  // north+
  if (agentB.y === agentA.y &&
    agentB.x === agentA.x + 2
  ) { return 'north+' }

  // south+
  if (agentB.y === agentA.y &&
    agentB.x === agentA.x - 2
  ) { return 'south+' }

  // east+
  if (agentB.y === agentA.y + 2 &&
    agentB.x === agentA.x
  ) { return 'east+' }

  // west+
  if (agentB.y === agentA.y - 2 &&
    agentB.x === agentA.x
  ) { return 'west+' }

  return
}

// function digest() {
//   let finalGrid = []
//   for (let y = 0; y < graphSize; y++) {
//     let row = []
//     for (let x = 0; x < graphSize; x++) {
//       row.push('empty')
//     }
//     finalGrid.push(row)
//   }

//   const agentsWithPaths = test()

//   let continueFlag = true
//   let step = 0
//   while (continueFlag) {
//     continueFlag = false

//     for (let agent of agentsWithPaths) {
//       if (step < agent.path.length) {
//         continueFlag = true

//         finalGrid[agent.path[step].y][agent.path[step].x] = agent.color
//       }
//     }

//     step++
//   }

//   return finalGrid
// }



function getNode(x, y, graph) {
  return graph.nodes.find((el) => el.x === x && el.y === y)
}

export { createNewSim, toySim };
