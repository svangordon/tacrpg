
import { TURN_ACTIONS, UNIT_ACTIONS, AI_ACTIONS } from '../actions/actions'


const initialState = {
  squads: [

  ],
  beasts: [
    1
  ],
  turnBegun: false
}

function ai(state = initialState, action) {
  switch (action.type) {
    case AI_ACTIONS.START_AI_TURN: {
      alert('starting ai turn')
      return Object.assign({}, state, {
        turnBegun: true
      })
    }
    case AI_ACTIONS.SET_BEASTS: {
      return Object.assign({}, state, {
        beasts: action.beasts
      })
    }
    default:
      return state
  }
}

export default ai
