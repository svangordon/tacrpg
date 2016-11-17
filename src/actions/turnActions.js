import { TURN_ACTIONS } from './actions'

export function setMovePath(movePath) {
  return {
    type: TURN_ACTIONS.SET_MOVE_PATH,
    movePath
  }
}

export function clickTile(tile) {
  return {
    type: TURN_ACTIONS.CLICK_TILE,
    tile
  }
}

export function setMoveSquares() {
  return {
    type: TURN_ACTIONS.SET_MOVE_SQUARES
  }
}

export function cancelMove() {
  return {
    type: TURN_ACTIONS.CANCEL_MOVE
  }
}

export function toggleAttackRange(showValue) {
  return {
    type: TURN_ACTIONS.TOGGLE_ATTACK_RANGE,
    showValue
  }
}

export function setAttack(attackTarget) {
  return {
    type: TURN_ACTIONS.SET_ATTACK,
    attackTarget
  }
}

export function finishTurn() {
  return {
    type: TURN_ACTIONS.FINISH_TURN
  }
}

export function setActiveUnitMoved(activeUnitMoved) {
  return {
    type: TURN_ACTIONS.SET_ACTIVE_UNIT_MOVED,
    activeUnitMoved
  }
}

export function setPfMap(pfMap, landmap) {
  return {
    type: TURN_ACTIONS.SET_PF_ARR,
    pfMap,
    landmap
  }
}

export function setAttackSquares() {
  return {
    type: TURN_ACTIONS.SET_ATTACK_SQUARES
  }
}

export function setAttackTarget(attackTarget) {
  return {
    type: TURN_ACTIONS.SET_ATTACK_TARGET,
    attackTarget
  }
}

export function confirmAttack() {
  return {
    type: TURN_ACTIONS.CONFIRM_ATTACK
  }
}

export function finishUnit(unitId) {
  return {
    type: TURN_ACTIONS.FINISH_UNIT,
    unitId
  }
}
