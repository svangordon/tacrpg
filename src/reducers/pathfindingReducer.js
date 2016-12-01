
import { PATHFINDING_ACTIONS } from '../actions/actions'

// responsible for handling pathfinding, etc
// Holds movemaps and ish, now that we're writing our own pf

const initialState = {
  moveMaps: null
}

function pathfinding(state = initialState, action) {
  switch (action.type) {
    case PATHFINDING_ACTIONS.GET_MOVE_MAPS: {
      // console.log('getting move Maps', action)
      // console.log(JSON.stringify(action))
      const terrainmap = action.terrainmap
      const width = 15 // Its a problem that I'm hardcoding this. idk where to put it?
      const len = terrainmap.length
      const getNeighbors = node => {
        /*
          . 0 .
          1 * 2
          . 3 .
        */
        let neighbors = []
        neighbors[0] = node - width >= 0 ? node - width : null
        neighbors[1] = node % width > 0 ? node - 1 : null
        neighbors[2] = (node + 1) % width !== 0 ? node + 1 : null
        neighbors[3] = node + width < len ? node + width : null
        return neighbors
      }
      const movemaps = action.units.map(unit => {
        // generate a move map for the unit
        // const getMoveCost = node =>
        const getNodeCost = node => { // move cost of entering a given node
          const moveCost = JSON.parse(terrainmap[node].layers.land.terrainType.properties.moveCost)[unit.moveType]
          console.log(moveCost)
        }
        getNodeCost(112)
        const movemap = []
        const startNode = unit.position
      })

      // const getNeighborsCost

      return Object.assign({}, state, {
        turnBegun: true
      })
    }
    default:
      return state
  }
}

export default pathfinding
