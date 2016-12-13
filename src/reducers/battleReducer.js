
import { TURN_ACTIONS, UNIT_ACTIONS } from '../actions/actions'
import { torvaldMaker, giantMaker, knightMaker, horseMaker, spearmanMaker } from '../utilities/characterConstructors'
import { basemap } from '../assets/basemap'
import { mapConstructor, tileGetter } from '../utilities/mapConstructor'


const initialState = {
  activePlayer: 0,
  activeUnit: null,
  activeUnitMoved: false,
  attackMap: null, // not squares current unit can attack, but a map of attack targets for possible move positions
  attackSquares: null,
  attackTarget: {},
  // basemap: basemap,
  finishedUnits: [],
  movePath: null,
  moveSquares: null,
  needsSync: false,
  showAttack: false,
  turnCount: 0,
  // terrainmap: constructedMap,
  units: [
    knightMaker(80), horseMaker(98), spearmanMaker(82)
  ]
}
const constructedMap = mapConstructor(basemap).map(tile => Object.assign({}, tile, {layers: Object.assign(tile.layers)}))
initialState.basemap = mapConstructor(basemap).map(tile => Object.assign({}, tile, {layers: Object.assign(tile.layers)}))
initialState.terrainmap = constructedMap

// const idsByOwner = [0, 1].map(owner => [0, initialState.units.filter(unit => unit.owner === owner).reduce(unit => unit.id)])
// initialState.order = [0, 1].map(owner => [0, initialState.units.filter(unit => unit.owner === owner).map(unit => unit.id)])
// idsByOwner.forEach((ids, i) => {initialState.order})
function battle(state = initialState, action) {
  switch (action.type) {
    case TURN_ACTIONS.CANCEL_MOVE: {
      return Object.assign({}, state, {
        activeUnit: null,
        activeUnitMoved: false,
        attackTarget: {},
        attackSquares: null,
        movePath: null,
        moveSquares:null,
        needsSync: true,
        showAttack: false
      })
    }
    case TURN_ACTIONS.FINISH_TURN: {
      return Object.assign({}, state,
      {
        activePlayer: (state.activePlayer + 1) % 2,
        activeUnit: null,
        activeUnitMoved: false,
        attackSquares: null,
        attackTarget: {},
        finishedUnits: [],
        movePath: null,
        moveSquares:null,
        needsSync: true,
        showAttack: false,
        turnCount: state.turnCount + 1
      })
    }

    case TURN_ACTIONS.SET_ATTACK: {
      return Object.assign({}, state, {
        attackTarget: action.attackTarget,
        needsSync: true
      })
    }
    case TURN_ACTIONS.SET_MOVE_PATH: {
      return Object.assign({}, state, {
        movePath: state.moveSquares[action.movePath][1],
        needsSync: true
      })
    }
    case UNIT_ACTIONS.SYNC_UNITS: {

      const t1 = performance.now()
      const newmap = state.basemap.map(tile => Object.assign({}, tile, {layers: Object.assign({}, tile.layers)}))
      state.units.forEach(unit => {
        const unitPosition = state.activeUnit && state.activeUnit.id === unit.id ? state.activeUnit.position : unit.position
        newmap[unitPosition].layers.unit = {
          data: unit.sprite,
          name: 'unit',
          offset: tileGetter(unit.sprite),
          opacity: 1,
          unitId: unit.id
        }
        if (state.finishedUnits[unit.id]) { // finished move
          newmap[unitPosition].layers.moveStatus = {
            data: 299,
            name: 'square',
            offset: tileGetter(299),
            opacity: 1
          }
        }
      })
      if (state.moveSquares && !state.activeUnitMoved) {
        state.moveSquares.forEach((moveSquare, i) => {
          if (moveSquare[0] !== -1) {
            newmap[i].layers.move = { // moveRange
              data: 298,
              name: 'square',
              offset: tileGetter(298),
              opacity: 0.5
            }
          }
        })
      }
      if (state.movePath && !state.showAttack) {
        state.movePath.forEach((moveSquare, i) => {
          console.log()
          newmap[moveSquare].layers.move = { // movePath
            data: 298,
            name: 'square',
            offset: tileGetter(298),
            opacity: 1
          }
        })
      }
      if (state.showAttack && !state.attackTarget.valid && state.attackSquares) {
        state.attackSquares.forEach((attackSquare, i) => {
          if (attackSquare.valid) {
            newmap[i].layers.attack = { // attack range
              data: 298,
              name: 'square',
              offset: tileGetter(297),
              opacity: 0.5
            }
          }
        })
      }
      if (state.attackTarget.position && state.attackSquares[state.attackTarget.position].valid) {
        newmap[state.attackTarget.position].layers.attack = { // attackTarget
          data: 298,
          name: 'square',
          offset: tileGetter(297),
          opacity: 1
        }
      }
      const t2 = performance.now()
      // console.log('original sync took', t2 - t1, 'ms')

      // const t3 = performance.now()
      // const altmap = state.basemap.map(tile => Object.assign({}, tile, {layers: Object.assign({}, tile.layers)}))
      // const limit = state.moveSquares.length
      // for (let i = 0; i < limit; i++) {
      //   if (state.moveSquares[i].valid) {
      //     altmap[i].layers.square = { // moveRange
      //       data: 298,
      //       name: 'square',
      //       offset: tileGetter(298),
      //       opacity: 0.5
      //     }
      //   }
      //
      // }
      // const t4 = performance.now()
      //
      // console.log('new sync took', t4 - t3, 'ms')
      // console.log('newSync was ==', (t2 - t1) - (t4 - t3), 'ms faster')
      return Object.assign({}, state, {
        needsSync: false,
        terrainmap: newmap
      })
    }

    case TURN_ACTIONS.TOGGLE_ATTACK_RANGE: {
      return Object.assign({}, state, {
        needsSync: true,
        showAttack: action.showValue === undefined ? !state.showAttack : action.showValue
      })
    }

    case UNIT_ACTIONS.UPDATE_UNIT:
      return Object.assign({}, state, {
        needsSync: true,
        units: state.units.map(unit => {
          if (unit.id === action.unit.id) {
            return action.unit
          } else {
            return unit
          }
        })
      })


    case UNIT_ACTIONS.MOVE_UNIT: {
      // This can be replaced w/ an action that's intercepted by mw, and dispatches the update unit action
      // console.log('reducer stat ==', state, 'action', action)
      return Object.assign({}, state, {
        activeUnit: null,
        needsSync: true,
        units: state.units.map(unit => {
          if (unit.position !== state.activeUnit.position) {
            return unit
          }
          unit.position = action.tileId
          return unit
        })
      })
    }
    case UNIT_ACTIONS.SET_ACTIVE_UNIT:
      return Object.assign({}, state, {
        activeUnit: action.activeUnit,
        needsSync: true
      })

    case TURN_ACTIONS.SET_MOVE_SQUARES:
      return Object.assign({}, state, {
        attackMap: action.attackMap,
        moveSquares: action.moveSquares,
        needsSync: true
      })

    case TURN_ACTIONS.SET_ACTIVE_UNIT_MOVED:
      return Object.assign({}, state, {
        activeUnitMoved: action.activeUnitMoved,
        needsSync: true
      })

    case TURN_ACTIONS.SET_ATTACK_SQUARES:
      return Object.assign({}, state, {
        attackSquares: action.attackSquares,
        needsSync: true,
        validTarget: action.validTarget
      })

    case TURN_ACTIONS.SET_ATTACK_TARGET:
      return Object.assign({}, state, {
        attackTarget: action.attackTarget,
        needsSync: true
      })

    case TURN_ACTIONS.SET_PF_ARR:
      return Object.assign({}, state, {
        pfMap: action.pfMap,
        landmap: action.landmap
      })

    case TURN_ACTIONS.FINISH_UNIT: {
      console.log('action ==', action)
      const newFinishedUnits = state.finishedUnits.slice()
      newFinishedUnits[state.activeUnit.id] = true
      return Object.assign({}, state, {
          activePlayer: action.finishTurn ? (state.activePlayer + 1) % 2 : state.activePlayer,
          activeUnit: null,
          activeUnitMoved: false,
          attackTarget: {},
          attackSquares: null,
          finishedUnits: action.finishTurn ? [] : newFinishedUnits,
          movePath: null,
          moveSquares:null,
          needsSync: true,
          showAttack: false,
          turnCount: action.finishTurn ? state.turnCount : state.turnCount + 1
      })
    }
    case UNIT_ACTIONS.KILL_UNIT: {
      const newUnits = state.units.filter(unit => {action.unitId !== unit.id})
      return Object.assign({}, state, {
        needsSync: true
      })
    }
    default:
      return state
  }
}

export default battle
