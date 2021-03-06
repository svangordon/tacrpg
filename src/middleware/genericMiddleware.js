import { UNIT_ACTIONS, TURN_ACTIONS } from '../actions/actions'
import { resolveAttack, moveUnit, updateUnit, setActiveUnit, killUnit } from '../actions/unitActions'
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
    const speedDiff = attacker.speed - defender.speed
    const attackerDamage = attacker.strength - defender.armor
    const defenderDamage = defender.strength - attacker.armor

    let attackerDodge = speedDiff > 0 && Math.random() < speedDiff / 10
    let defenderDodge = speedDiff < 0 && Math.random() < -speedDiff / 10
    if (!defenderDodge) {
      defender.hp = defender.hp - attackerDamage
    }
    if (defender.hp >= 0) {
      attacker.hp = attacker.hp - defenderDamage
    }
    if (defender.hp < 0) {
      console.log(attacker.name, 'killed', defender.name)
      attacker.exp = attacker.exp + 1
      store.dispatch(killUnit(defender))
    }
    if (attacker.hp < 0) {
      console.log(defender.name, 'killed', attacker.name)
      defender.exp = defender.exp + 1
      store.dispatch(killUnit(attacker))
    }
    if (defender.hp > 0) {
      store.dispatch(updateUnit(defender))
    }
    if (attacker.hp > 0) {
      store.dispatch(updateUnit(defender))
    }
    //
    // const missChance = Math.min(Math.max(defender.speed - attacker.speed, 0) / 10, 0.9)
    // const damage = attacker.strength - defender.armor
    // if (missChance < Math.random()) {
    //   console.log('hit')
    //   defender.hp = defender.hp - damage
    //   if (defender.hp < 0) {
    //     console.log(attacker.name, 'killed', defender.name)
    //
    //   }
    // }
    // store.dispatch(updateUnit(Object.assign({}, defender, {
    //   hp: defender.hp - 1
    // })))
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
  }

  if (action.type === TURN_ACTIONS.SET_MOVE_SQUARES) {
    const getNeighborsId = (node) => {
        //
        //  . 0 .
        //  1 * 2
        //  . 3 .
        //
        const neighbors = []
        neighbors[0] = node - width >= 0 ? node - width : null
        neighbors[1] = node % width > 0 ? node - 1 : null
        neighbors[2] = (node + 1) % width !== 0 ? node + 1 : null
        neighbors[3] = node + width < mapLength ? node + width : null
        return neighbors
    }

    const width = 15
    const terrainmap = state.battle.terrainmap
    const units = state.battle.units
    const mapLength = terrainmap.length
    const unit = state.battle.activeUnit

    const setUnitHelperFn = (unit) => {
      const moveType = unit.moveType
      return (node) => {
        const maptile = terrainmap[node]
        try {
          const moveCosts = JSON.parse(maptile.layers.land.terrainType.properties.moveCost)
          // console.log(moveCosts[moveType])
          return moveCosts[moveType]
        } catch(e) {
          return -1
        }
      }
    }

    const getAttackTargets = (node) => {
      const attackMap = Array(mapLength)
      attackMap[node] = 'start'
    /*// for ranged attacks:
      for (let i = 0; i < unit.range; i++) {
        neighbors = neighbors.map(node => getNeighborsId(node))
          .reduce((accum, curArr) => accum.concat(curArr), [])
          //.deDupe it somehow
      }
    */
    const neighbors = getNeighborsId(node)
      .map(node => {
        let result = null
        try {
          const unitId = state.battle.terrainmap[node].layers.unit.unitId
          console.log('unitId ==', unitId)
          const targetUnit = state.battle.units[unitId]
          console.log(targetUnit.owner, unit.owner)
          if (targetUnit.owner !== unit.owner) {
            console.log('found attack')
            result = [node, unitId] // unitId, square
          } else {
            result = null
          }
        } catch (e) {
          // console.log('error == ', e)
          return null
        }
        console.log('result ==', result)
        return result
      })
      console.log('neighbors ==', neighbors)
      return neighbors.some(node => node !== null) ? neighbors: null
    }

    const unitHelperFn = setUnitHelperFn(unit)

    const moveMap = Array(mapLength)
    const attackMap = Array(mapLength)

    // The most simple implementation
    const recursivelyGenMoveMap = (node) => {
      // first iteration
      if (moveMap[node] === undefined) {
        moveMap[node] = [0, [node]]
        attackMap[node] = getAttackTargets(node)
      }
      const neighbors = getNeighborsId(node)
      const curNode = moveMap[node]
      neighbors.forEach(neighborNode => {
        const neighborVal = moveMap[neighborNode]
        const moveCost = unitHelperFn(neighborNode)
        if (neighborNode === null) {
          console.log('error here')
          return
        }
        //  can move there       unit can afford move                  nieghbor moveMap not set or more expensive
        if (moveCost !== -1 && moveCost + curNode[0] < unit.move  && (!neighborVal || neighborVal[0] > curNode[0] + moveCost)) {
          // a place we can go, set the moveMap
          moveMap[neighborNode] = [curNode[0] + 1, curNode[1].concat([neighborNode])]
          // if there are attackers, set the attack map
          attackMap[neighborNode] = getAttackTargets(neighborNode)
          // and then recurse
          recursivelyGenMoveMap(neighborNode)
        }
      })
    }

    recursivelyGenMoveMap(unit.position)

    action.moveSquares = moveMap
    action.attackMap = attackMap

    // // determines whether the square should render a move range square
    //   const width = 15
    //   const height = 13
    //   const t1 = performance.now()
    //   action.moveSquares = state.battle.landmap.map((tile, i) => {
    //     if (tile === 1) {
    //       return {valid: false, path: null}
    //     }
    //     const pfGrid = new PF.Grid(state.battle.pfMap)
    //     const finder = new PF.AStarFinder()
    //     const path = finder.findPath(
    //       state.battle.activeUnit.position % width,
    //       Math.floor(state.battle.activeUnit.position / width),
    //       coords(i).arr[0],
    //       coords(i).arr[1],
    //       pfGrid
    //     ).map(coord => coords(coord).id)
    //     return {
    //       path,
    //       valid: path.length < state.battle.activeUnit.move + 2
    //     }
    //   })
    //   const t2 = performance.now()
  }

  if (action.type === TURN_ACTIONS.SET_ATTACK_SQUARES) {
    const width = 15
    const height = 13
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
    action.attackSquares = attackSquares
  }

  if (action.type === TURN_ACTIONS.FINISH_UNIT) {
    if (state.battle.attackTarget.valid) {
      store.dispatch(resolveAttack())
    }
    store.dispatch(updateUnit(state.battle.activeUnit))
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
    const clickedUnit = state.battle.units.find(unit => unit.position === action.tile)
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
    } else if (state.battle.moveSquares && state.battle.moveSquares && !state.battle.activeUnitMoved) {
      // clicked on empty square, which is in moveSquares, w/ an unmoved activeUnit
      const newActiveUnit = Object.assign({}, state.battle.activeUnit, {
        position: action.tile
      })
      store.dispatch(setActiveUnit(newActiveUnit))
      store.dispatch(setActiveUnitMoved(true))
      store.dispatch(setAttackSquares())
    }
  }
  next(action)
}
