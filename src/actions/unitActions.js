import { UNIT_ACTIONS } from './actions'

export function moveUnit(tileId) {
  return {
    type: UNIT_ACTIONS.MOVE_UNIT,
    tileId
  }
}

export function setActiveUnit(activeUnit) {
  // console.log('unitActions activeUnit ==', activeUnit)
  return {
    type: UNIT_ACTIONS.SET_ACTIVE_UNIT,
    activeUnit
  }
}

export function resolveAttack(defender) {
  return {
    type: UNIT_ACTIONS.RESOLVE_ATTACK,
    // defender
  }
}

export function updateUnit(unit) {
  return {
    type: UNIT_ACTIONS.UPDATE_UNIT,
    unit
  }
}

export function syncUnits() {
  return {
    type: UNIT_ACTIONS.SYNC_UNITS
  }
}

export function finishUnit(unit) {
  return {
    type: UNIT_ACTIONS.FINISH_UNIT,
    unit
  }
}

export function killUnit(unitId) {
  return {
    type: UNIT_ACTIONS.KILL_UNIT,
    unitId
  }
}
