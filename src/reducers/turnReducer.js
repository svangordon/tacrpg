
import { TURN_ACTIONS } from '../actions/actions'

const initialState = {
  activePlayer: 'player',
  turnCount: 0,
  movePath: null,
  showAttack: false,
  attackTarget: null
}

function turn(state = initialState, action) {
  switch (action.type) {
    case TURN_ACTIONS.FINISH_TURN:
      console.log(state.activePlayer, state.activePlayer === 'player')
      return Object.assign({}, state, {
        turnCount: state.turnCount + 1,
        activePlayer: state.activePlayer === 'player' ? 'computer' : 'player',
        movePath: null,
        showAttack: false,
        attackTarget: null
      })
    case TURN_ACTIONS.SET_MOVE_PATH:
      return Object.assign({}, state, {
        movePath: action.movePath
      })
    case TURN_ACTIONS.CANCEL_MOVE:
      return Object.assign({}, state, {
        showAttack: false,
        attackTarget: null,
        movePath: null
      })
    case TURN_ACTIONS.SET_ATTACK:
      return Object.assign({}, state, {
        attackTarget: action.attackTarget
      })
    case TURN_ACTIONS.TOGGLE_ATTACK_RANGE:
      if (action.showValue) {
        return Object.assign({}, state, {
          showAttack: action.showValue
        })
      }
      return Object.assign({}, state, {
        showAttack: !state.showAttack
      })
    default:
      return state
  }
}

export default turn
