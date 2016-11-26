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
    const beasts = []
    const squads = []
    const aiUnits = state.battle.units.filter(unit => unit.owner === 1)
    aiUnits.forEach(unit => {
      if (unit.beast) {
        beasts.push(unit)
      } //else, handle squads
    })
    store.dispatch(setBeasts(beasts))
  }
  next(action)
}
