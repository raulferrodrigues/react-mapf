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
  agents = NaiveCollisionAvoidance(agents, graph)

  console.debug('graph')
  console.debug(graph.toString())

  return video(agents, graph)
}

function video(agents, graph) {
  let frames = []
  let initialFrame = []

  frames.push(initialFrame)

  // Produz of frame base
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

function videoCBS(data, grid) {
  console.debug('heyo')

  let frames = []
  let initialFrame = []

  frames.push(initialFrame)

  // Produz of frame base
  for (let x = 0; x < grid.length; x++) {
    let column = []
    for (let y = 0; y < grid.length; y++) {
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

    for (const agent in data) {
      if (agent && step < data[agent].length) {
        continueFlag = true

        // fazer novo frame
        newFrame[data[agent][step].x][data[agent][step].y] = agent

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


function NaiveCollisionAvoidance(agents, graph) {
  // Param hygiene
  // const agents = deepcopy(agentsparam)
  // const graph = deepcopy(graphparam)
  // ...

  let continueFlag = true
  let step = 0

  while (continueFlag) {
    continueFlag = false

    // Check if all agents have reached their destination. If not then set continueFlag to true and keep running the simulation.
    // Make every node with an agent a wall for this step. Change it back on the end of the step.
    agents.forEach((agent) => {
      if (step < agent.path.length) { 
        continueFlag = true
        const node = agent.path[step]
        node.weight = 0
      }
    })

    if (!continueFlag) { break }

    const agentsWithCollisions = testCollisions(agents, step)
    if (agentsWithCollisions.length !== 0) {      
      agentsWithCollisions.forEach((agentWithCollision) => {
        const { agent, collisions } = agentWithCollision
        // if this agent will stop and wait for the other agents in the collision to reroute
        let stop = false

        collisions.forEach(collision => {
          if (agent.priority > collision.priority) {
            stop = true
          }
        })

        // if it's a high priority agent in this collision set,
        // then it should stop and wait while the other agents reroute
        // otherwise it should reroute 
        if (stop) {
          const bubble = agent.path[step]
          agent.path.splice(step + 1, 0, bubble)
        } 

        else {
          agent.path.length = step + 1
          let newPathSegment = astar.search(graph, agent.path[step], agent.end, undefined)
          agent.path.push(...newPathSegment)
        }
      })
    }
    
    agents.forEach((agent) => {
      if (step < agent.path.length) {
        const node = agent.path[step]
        node.weight = 1
      }
    })

    step++
  }

  return agents
}

function testCollisions(agents, step) {
  let agentsWithCollisions = []

  // Para cada agente (agent)
  agents
    .forEach(agent => {
      const collisions = []

      // Com cada um dos outros agentes
      agents
        .filter(ag => ag !== agent)
        .forEach(otherAgent => {
          // Observa se há conflito com o agente incial (agent) e o outro agente da lista (otherAgent)
          // Se sim, adiciona o outro agente (otherAgent) ao array de colisões 
          console.debug('step', step)
          const observation = observe(agent.path[step], otherAgent.path[step])
          if (observation) { collisions.push(otherAgent) }
        })
      
      // Se o tamanho de array de colisões for maior do que zero
      // Adiciona o agente (agent) ao array de agentes com colisões (agentsWithCollisions) 
      if (collisions.length > 0) {
        agentsWithCollisions.push({ agent, collisions })
      }
    })
  
  return agentsWithCollisions
}

function observe(agentA, agentB) {
  if (agentA === undefined || agentB === undefined) { return }
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

export { createNewSim, videoCBS };
