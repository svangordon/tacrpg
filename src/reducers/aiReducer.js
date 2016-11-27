
import { TURN_ACTIONS, UNIT_ACTIONS, AI_ACTIONS } from '../actions/actions'


const initialState = {
  squads: null,
  beasts: null,
  turnBegun: false
}

function ai(state = initialState, action) {
  switch (action.type) {
    case AI_ACTIONS.START_AI_TURN: {
      console.log('starting ai turn')
      return Object.assign({}, state, {
        turnBegun: true
      })
    }
    case AI_ACTIONS.SET_BEASTS: {
      const beasts = action.beasts
      // const determineBeastAction = (beast) => {
      //
      // }
      return Object.assign({}, state, {
        beasts: action.beasts
      })
    }
    default:
      return state
  }
}

export default ai
