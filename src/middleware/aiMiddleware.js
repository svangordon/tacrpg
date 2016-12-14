import { AI_ACTIONS, UNIT_ACTIONS, TURN_ACTIONS } from '../actions/actions'
import { resolveAttack, moveUnit, updateUnit, setActiveUnit, killUnit } from '../actions/unitActions'
import { setMoveSquares, finishTurn, setActiveUnitMoved, setAttackSquares, setAttackTarget, finishUnit } from '../actions/turnActions'
import { setBeasts } from '../actions/aiActions'
import { coords } from '../utilities/UtilityContainer'
import PF from 'pathfinding'

export const aiMiddleware = store => next => action => {
  const state = store.getState()
  if (action.type === AI_ACTIONS.START_AI_TURN) {
    // gather all the ai, sort into squads?
    const squads = []
    const aiUnits = state.battle.units.filter(unit => unit.owner === 1)
    console.log('aiUnits ==', aiUnits)
    const beasts = aiUnits.filter(unit => unit.beast)
    // alright, so we're going to loop over the beasts array, and figure out what
    // they're all doing.
    const determineBeastAction = (beasts, battleMap) => {
      const beastActions = beasts.map(beast => {
        let beastMove = null
        let beastAttack = null
        if (beast.behavior === 'lurk') { //TODO: make a constant
          //lurk behavior: gen all possible moves, pick one at random
        }
        return [beast, beastMove, beastAttack]
      })
    }

    aiUnits.forEach(aiUnit => {
      store.dispatch(setActiveUnit(aiUnit))
      console.log(state.battle.attackMap)
    })
  }
  // if (action.type === AI_ACTIONS.SET_BEASTS) {
  //   // In theory, check to see if squads have been set and if so fire a 'start
  //   // processing ai units' action. Or not. Just make sure there's no race condition
  //   // b/w squads and beasts. Oh, right, we can just figure this all out in the
  //   // reducer. So most likely we want to have it set up array[s] of what each
  //   // beast's action will be, and then call another action to tell the MW to
  //   // dispatch the proper actions for each move.
  //   store.dispatch()
  // }
  next(action)
}
