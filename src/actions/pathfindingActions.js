import { PATHFINDING_ACTIONS } from './actions'

export function getMoveMaps(units, terrainmap) {
  return {
    type: PATHFINDING_ACTIONS.GET_MOVE_MAPS,
    units,
    terrainmap
  }
}
