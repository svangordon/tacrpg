
import { MOVE_ACTIONS } from '../actions/actions'

// responsible for handling pathfinding, etc
// Holds movemaps and ish, now that we're writing our own pf

const initialState = {
  moveMaps: null
}

function move(state = initialState, action) {
  switch (action.type) {
    case MOVE_ACTIONS.GET_MOVE_MAPS: {
      console.log('starting ai turn')
      return Object.assign({}, state, {
        turnBegun: true
      })
    }
    default:
      return state
  }
}

export default move
