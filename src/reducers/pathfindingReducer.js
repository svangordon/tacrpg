
import { PATHFINDING_ACTIONS } from '../actions/actions'

// responsible for handling pathfinding, etc
// Holds movemaps and ish, now that we're writing our own pf

const initialState = {
  moveMaps: null
}

function pathfinding(state = initialState, action) {
  switch (action.type) {
    case PATHFINDING_ACTIONS.GET_MOVE_MAPS: {
      console.log('getting move Maps', action)
      const terrainmap = action.terrainmap
      const units = action.units.map(unit => {
        // generate a move map for the unit
        // const getMoveCost = node =>
        const movemap = []
        const startNode = unit.position

      })

      return Object.assign({}, state, {
        turnBegun: true
      })
    }
    default:
      return state
  }
}

export default pathfinding
