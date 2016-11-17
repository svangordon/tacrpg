import { UNIT_ACTIONS, TURN_ACTIONS } from '../actions/actions'
import { resolveAttack, moveUnit, updateUnit, setActiveUnit } from '../actions/unitActions'
import { setMoveSquares, finishTurn, setActiveUnitMoved, setAttackSquares, setAttackTarget, finishUnit } from '../actions/turnActions'
import { coords } from '../utilities/UtilityContainer'
import PF from 'pathfinding'

export const unitMiddleware = store => next => action => {
  const state = store.getState()
  if (action.type === UNIT_ACTIONS.RESOLVE_ATTACK) {
    const attacker = state.battle.activeUnit
    const defender = state.battle.attackTarget
    if (!defender.valid) {
      throw new Error('invalid attack target')
    }
    delete defender.valid
    store.dispatch(updateUnit(Object.assign({}, defender, {
      hp: defender.hp - 1
    })))
  }
  next(action)

}

export const turnMiddleware = store => next => action => {
  const state = store.getState()
  // const activeUnit = state.battle.units.find(unit => unit.id === state.battle.order[state.battle.activePlayer][1][state.battle.order[state.battle.activePlayer][0]])
  // if (action.type === TURN_ACTIONS.FINISH_TURN) {
  //   if (state.battle.attackTarget) {
  //     store.dispatch(resolveAttack())
  //   }
  //   if (state.battle.movePath) {
  //     store.dispatch(moveUnit(activeUnit, state.battle.movePath))
  //   }
  // }

  // idea: have the player play over several iterations of the same map (perhaps
// described in-game as 'generations'.) the player buys upgrades for units b/w
// generations

  if (action.type === TURN_ACTIONS.CONFIRM_ATTACK) {
    const attacker = Object.assign({}, state.battle.activeUnit)
    const defender = Object.assign({}, state.battle.attackTarget)
    defender.hp = defender.hp - 1
    // store.dispatch(updateUnit(defender))
    store.dispatch(updateUnit(attacker))
    store.dispatch(finishUnit(attacker.id))
  }

  if (action.type === TURN_ACTIONS.SET_PF_ARR) {
    const landmap = state.battle.terrainmap.map(
      tile => Number(!~tile.layers.land.data)
    )
    const width = 15
    const height = 13
    const pfMap = []
    for (let i = 0; i < height; i++) {
      pfMap.push(landmap.slice(i * width, (i + 1) * width))
    }
    action.landmap = state.battle.terrainmap.map(
      tile => Number(!~tile.layers.land.data)
    )
    action.pfMap = pfMap
    console.log('setSqMw sez', action)
  }

  if (action.type === TURN_ACTIONS.SET_MOVE_SQUARES) {
    // determines whether the square should render a move range square
      if (!state.battle.activeUnit) {
        console.log('reached what should be impossible position')
        return null
      }
      const width = 15
      const height = 13
      action.moveSquares = state.battle.landmap.map((tile, i) => {
        if (tile === 1) {
          return {valid: false, path: null}
        }
        // console.log(pfMap)
        const pfGrid = new PF.Grid(state.battle.pfMap)
        const finder = new PF.AStarFinder()
        const path = finder.findPath(
          state.battle.activeUnit.position % width,
          Math.floor(state.battle.activeUnit.position / width),
          coords(i).arr[0],
          coords(i).arr[1],
          pfGrid
        )
        return {
          path,
          valid: path.length < state.battle.activeUnit.move + 2
        }
      })
  }

  if (action.type === TURN_ACTIONS.SET_ATTACK_SQUARES) {
    const width = 15
    const height = 13
    if (!state.battle.activeUnit) {
      console.log('reached what should be impossible position')
      return null
    }
    const unitPos = []
    state.battle.units.forEach(unit => {
      unitPos[unit.position] = unit
    })

    const attackSquares = state.battle.landmap.map((tile,i) => {
      const pfGrid = new PF.Grid(15, 13)
      const finder = new PF.AStarFinder()
      const path = finder.findPath(
        state.battle.activeUnit.position % width,
        Math.floor(state.battle.activeUnit.position / width),
        coords(i).arr[0],
        coords(i).arr[1],
        pfGrid
      )
      // const targetCoord = coords(i).arr
      // const attackerCoord = coords(state.battle.activeUnit.position).arr
      // const distance = Math.sqrt(Math.pow(targetCoord[0] - attackerCoord[0], 2) + Math.pow(targetCoord[1] - attackerCoord[1], 2))
      // console.log('path ==', path)
      const output = {
        valid: path.length <= state.battle.activeUnit.range + 1,
        unit: unitPos[i]
      }
      if (output.valid && output.unit && !action.validTarget) {
        action.validTarget = true
      }
      return output
    })
    // console.log('atkSqs', attackSquares)
    action.attackSquares = attackSquares
  }

  if (action.type === TURN_ACTIONS.FINISH_UNIT) {
    console.log('finishing unit')
    if (state.battle.attackTarget.valid) {
      store.dispatch(resolveAttack())
    }
    store.dispatch(updateUnit(state.battle.activeUnit))
    // console.log('unit is now at, is this sync?', state.battle.units.find(unit => unit.id === state.battle.activeUnit.id).position)
    if (
      state.battle.finishedUnits.reduce((accum, moveStatus) => {
        if (moveStatus) {
          return accum + 1
        }
        return accum
      },0) + 1 ===
      state.battle.units.filter(unit => unit.owner === state.battle.activePlayer).length
    ) {
      // all of activeplayer's units have moved
      console.log('should finish turn')
      action.finishTurn = true
    } /*else {
      console.log(state.battle.finishedUnits.reduce((accum, moveStatus) => {
        console.log(moveStatus, accum)
        if (moveStatus) {
          return accum + 1
        }
        return accum
        // return moveStatus ? accum : accum + 1
      }, 0),
      state.battle.units.filter(unit => unit.owner === state.battle.activePlayer).length)
    }*/
  }

  next(action)
}

export const clickMiddleware = store => next => action => {
  const state = store.getState()
  if (action.type === TURN_ACTIONS.CLICK_TILE) {
    // alert('bang')
    const clickedUnit = state.battle.units.find(unit => unit.position === action.tile)
    console.log('clickedUnit', clickedUnit)
    // player clicked on unit
    if (clickedUnit) {
      // player clicked on own unit
      if (clickedUnit.owner === state.battle.activePlayer) {
        if (!state.battle.finishedUnits[clickedUnit.id]) {
          if (state.battle.activeUnit && state.battle.activeUnit.id === clickedUnit.id) {
            const newActiveUnit = Object.assign({}, state.battle.activeUnit, {
              position: action.tile
            })
            store.dispatch(setActiveUnit(newActiveUnit))
            store.dispatch(setActiveUnitMoved(true))
            store.dispatch(setAttackSquares())
          }
          store.dispatch(setActiveUnit(clickedUnit))
          store.dispatch(setMoveSquares())
        }
      } else { //clicked opponent's unit
        if (state.battle.showAttack && state.battle.attackSquares[action.tile].valid) {
          store.dispatch(setAttackTarget(Object.assign({},
            state.battle.attackSquares[action.tile].unit,
            {valid: true}
          )))
        }
      }
    } else if (state.battle.moveSquares && state.battle.moveSquares[action.tile] && !state.battle.activeUnitMoved) {
      // clicked on empty square, which is in moveSquares, w/ an unmoved activeUnit
      const newActiveUnit = Object.assign({}, state.battle.activeUnit, {
        position: action.tile
      })
      store.dispatch(setActiveUnit(newActiveUnit))
      store.dispatch(setActiveUnitMoved(true))
      store.dispatch(setAttackSquares())
    } else {
      console.log('base case')
    }
  }
  next(action)
}
