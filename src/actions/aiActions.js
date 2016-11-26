import { AI_ACTIONS } from './actions'

export function initAi() {
  return {
    type: AI_ACTIONS.INIT_AI
  }
}

export function setBeasts(beasts) {
  return {
    type: AI_ACTIONS.SET_BEASTS,
    beasts
  }
}

export function startAiTurn() {
  return {
    type: AI_ACTIONS.START_AI_TURN
  }
}
