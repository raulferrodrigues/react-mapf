import { astar, Graph } from "./astar.js";
import { example1 } from "./simTemplates.js";
import * as deepcopy from 'deepcopy';

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

const settings = example1()

const graphSize = settings.graphSize
const graph = settings.graph
const agents = settings.agents

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

function sim(agentsWithPaths) {
  let continueFlag = true
  let step = 0

  console.debug("path", agentsWithPaths[0].path)

  while (continueFlag) {
    continueFlag = false
    let locations = []

    for (let agent of agentsWithPaths) {
      if (step < agent.path.length) {
        continueFlag = true

        locations.push({
          agent,
          x: agent.path[step].x,
          y: agent.path[step].y
        })
      }
    }

    const conflicts = conflict(locations)

    if (conflicts.length !== 0) {
      for (let collision of conflicts) {
        let collisionNode
        let previousCollisionNodeWeight

        let highPriorityAgent
        let lowPriorityAgent
        
        // Se a prioridade of agent foi maior que a do otherAgent, pausamos o otherAgent
        if (collision.agent.agent.priority > collision.otherAgent.agent.priority) {
          highPriorityAgent = collision.agent.agent
          lowPriorityAgent = collision.otherAgent.agent
        } else {
          highPriorityAgent = collision.otherAgent.agent
          lowPriorityAgent = collision.agent.agent
        }

        const bubble = lowPriorityAgent.path[step]
        lowPriorityAgent.path.splice(step + 1, 0, bubble)

        collisionNode = getNode(bubble.x, bubble.y, graph)
        previousCollisionNodeWeight = collisionNode.weight
        collisionNode.weight = 0

        highPriorityAgent.path.length = step + 1
        let newPathSegment = []
        console.debug("new seg", highPriorityAgent.path[step], highPriorityAgent.end)
        newPathSegment.push(...astar.search(graph, highPriorityAgent.path[step], highPriorityAgent.end, undefined))
        highPriorityAgent.path.push(...newPathSegment)

        collisionNode.weight = previousCollisionNodeWeight
        console.debug("conflicts", conflicts)
      }
    }

    step++
  }

  return agentsWithPaths
}

/*
1
2

*/

function conflict(agentLocationPairs) {
  let agentsWithConflicts = []

  // Para todo o agente
  for (let agentWithLocation of agentLocationPairs) {
    // Pareando com todos os agentes
    for (let otherAgentWithLocation of agentLocationPairs) {
      // Se os dois agentes sendo pareados forem difirentes
      if (agentWithLocation.agent.id !== otherAgentWithLocation.agent.id) {
        // Faz os testes de conflito
        const observed = observe(agentWithLocation, otherAgentWithLocation)
        // Se houver conflitos
        if (observed === 1) {
          let skip = false
          // Tenta não colocar conflitos do tipo A | B se ja tem B | A
          for (let collision of agentsWithConflicts) {
            if (collision.agent === otherAgentWithLocation && collision.otherAgent === agentWithLocation) {
              skip = true
            }
          }

          // Nao coloca duplicatas
          if (!skip) {
            agentsWithConflicts.push({
              agent: agentWithLocation,
              otherAgent: otherAgentWithLocation
            })
          }
        }
      }
    }
  }

  return agentsWithConflicts
}

function getNode(x, y, graph) {
  return graph.nodes.find((el) => el.x === x && el.y === y)
}

function observe(agentA, agentB) {
  // north
  if (  agentB.y === agentA.y - 1 &&
        agentB.x === agentA.x
  ) { return 1 }

  // south
  if (  agentB.y === agentA.y + 1 && 
        agentB.x === agentA.x
  ) { return 1 }

  // west
  if (  agentB.y === agentA.y &&
        agentB.x === agentA.x - 1
  ) { return 1 }

  // east
  if (  agentB.y === agentA.y &&
        agentB.x === agentA.x + 1
  ) { return 1 }
}

function digest() {
  let finalGrid = []
  for (let y = 0; y < graphSize; y++) {
    let row = []
    for (let x = 0; x < graphSize; x++) {
      row.push("empty")
    }
    finalGrid.push(row)
  }

  const agentsWithPaths = test()

  let continueFlag = true
  let step = 0
  while (continueFlag) {
    continueFlag = false

    for (let agent of agentsWithPaths) {
      if (step < agent.path.length) {
        continueFlag = true

        finalGrid[agent.path[step].y][agent.path[step].x] = agent.color
      }
    }

    step++
  }

  return finalGrid
}

function video() {
  let frames = []
  let initialFrame = []

  frames.push(initialFrame)

  // Produz of frame inicial
  for (let y = 0; y < graphSize; y++) {
    let row = []
    for (let x = 0; x < graphSize; x++) {
      row.push("empty")
    }
    initialFrame.push(row)
  }

  // Roda a simulação
  for (let agent of agents) {
    // console.debug(agent.start, agent.end)
    let path = []
    path.push(agent.start)
    path.push(...astar.search(graph, agent.start, agent.end, undefined))
    
    agent.path = path
  }

  // Agentes com os caminhos
  let agentsWithPaths = sim(agents)

  // Estruturas para produzir o video
  let continueFlag = true
  let step = 0
  let lastFrame = deepcopy(initialFrame)

  // Produz o video
  while (continueFlag) {
    continueFlag = false
    let newFrame = deepcopy(initialFrame)

    for (let agent of agentsWithPaths) {
      if (step < agent.path.length) {
        continueFlag = true

        // fazer novo frame
        newFrame[agent.path[step].y][agent.path[step].x] = agent.color
      }
    }

    frames.push(newFrame)
    lastFrame = newFrame

    step++
  }

  return frames
}

export { test, graph, graphSize, digest, video };
