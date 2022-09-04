function observe(agentA, agentB) {
  // north
  if (agentB.y === agentA.y &&
    agentB.x === agentA.x + 1
  ) { return true }

  // south
  if (agentB.y === agentA.y &&
    agentB.x === agentA.x - 1
  ) { return true }

  // east
  if (agentB.y === agentA.y + 1 &&
    agentB.x === agentA.x
  ) { return true }

  // west
  if (agentB.y === agentA.y - 1 &&
    agentB.x === agentA.x
  ) { return true }

  // northeast
  if (agentB.y === agentA.y + 1 &&
    agentB.x === agentA.x + 1
  ) { return true }

  // northwest
  if (agentB.y === agentA.y - 1 &&
    agentB.x === agentA.x + 1
  ) { return true }

  // southeast
  if (agentB.y === agentA.y + 1 &&
    agentB.x === agentA.x - 1
  ) { return true }

  // southwest
  if (agentB.y === agentA.y - 1 &&
    agentB.x === agentA.x - 1
  ) { return true }

  // north+
  if (agentB.y === agentA.y &&
    agentB.x === agentA.x + 2
  ) { return true }

  // south+
  if (agentB.y === agentA.y &&
    agentB.x === agentA.x - 2
  ) { return true }

  // east+
  if (agentB.y === agentA.y + 2 &&
    agentB.x === agentA.x
  ) { return true }

  // west+
  if (agentB.y === agentA.y - 2 &&
    agentB.x === agentA.x
  ) { return true }

  return 0
}

export { observe }