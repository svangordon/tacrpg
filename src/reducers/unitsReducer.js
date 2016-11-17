
import { UNIT_ACTIONS } from '../actions/actions'
import { torvaldMaker, giantMaker } from '../utilities/characterConstructors'

const initialState = {
  player: [
    Object.assign({},giantMaker(), {
      position: [1,1]
    }),
    Object.assign({},torvaldMaker(), {
      position: [2,1]
    })
  ],
  activeUnit: null //{}
}


function units(state = initialState, action) {
  switch (action.type) {
    case UNIT_ACTIONS.SET_ACTIVE_UNIT:
      return Object.assign({}, state, {
        activeUnit: action.activeUnit
      })
    case UNIT_ACTIONS.MOVE_UNIT:
      console.log('reducer stat ==', state, 'action', action)
      return Object.assign({}, state, {
        player: state.player.map(oldUnit => {
          if (oldUnit.id !== state.activeUnit.id) {
            return oldUnit
          }
          oldUnit.position = action.coord
          return oldUnit
        }),
        activeUnit: null
      })
    case UNIT_ACTIONS.UPDATE_UNIT:
      return Object.assign({}, state, {
        player: state.player.map(unit => {
          if (unit.id === action.unit.id) {
            return action.unit
          }
          return unit
        })
      })
    default:
      return state
  }
}

export default units
