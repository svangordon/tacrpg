import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import ReactGridLayout                  from 'react-grid-layout'
import PF                               from 'pathfinding'

import { setActiveUnit, moveUnit, syncUnits }      from '../actions/unitActions'
import { setAttack, setPfMap }       from '../actions/turnActions'
import { initAi, startAiTurn }        from '../actions/aiActions'
import { getMoveMaps } from '../actions/pathfindingActions'
import TileContainer                    from './TileContainer'

const mapStateToProps = (state) => {
  return {
    battle: state.battle,
    // battleMap: state.battleMap,
    // units: state.units,
    // turn: state.turn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startAiTurn: () => {
      dispatch(startAiTurn())
    },
    getMoveMaps: (units, terrainmap) => {
      dispatch(getMoveMaps(units, terrainmap))
    },
    moveUnit: (unit, path) => {
      dispatch(moveUnit(unit, path))
    },
    setAttack: (target) => {
      dispatch(setAttack(target))
    },
    setPfMap: () => {
      dispatch(setPfMap())
    },
    syncUnits: () => {
      dispatch(syncUnits())
    }
  }
}

class BattleMapContainer extends Component {
  constructor(props) {
    super(props)
    props.setPfMap()
    props.syncUnits()
  }

  componentDidMount() {
    this.props.getMoveMaps(this.props.battle.units, this.props.battle.terrainmap)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.battle.needsSync) {
      this.props.syncUnits()
    }
    if (this.props.battle.activePlayer === 0 && nextProps.battle.activePlayer === 1) {
      this.props.startAiTurn()
    }
  }

  _getGridLayout() {
    return this.props.battle.terrainmap.map(tile => {
      return {
        i: String(tile.id),
        x: tile.x,
        y: tile.y,
        w: 1,
        h: 1,
        static: true
      }
    })
  }

  // _handleTileHover(tileId) {
  //   if (this.props.battle.activeUnit)
  // }

  render() {
    const spriteScale = 2
    return (
      <ReactGridLayout
        className="layout"
        cols={15}
        layout={this._getGridLayout()}
        margin={[0,0]}
        rowHeight={16 * spriteScale}
        width={240 * spriteScale}
      >
        {this.props.battle.terrainmap.map(tile => {
          return (
            <div className="wrapper" key={String(tile.id)}>
              <TileContainer
                spriteScale={spriteScale}
                tile={tile}
              />
            </div>
          )
        })}
      </ReactGridLayout>
    )
  }
}

BattleMapContainer.propTypes = {
  battle: PropTypes.object, // this should def be expanded
  battleMap: PropTypes.object,
  getMoveMaps: PropTypes.func,
  setActiveUnit: PropTypes.func,
  setAttack: PropTypes.func,
  setPfMap: PropTypes.func,
  startAiTurn: PropTypes.func,
  syncUnits: PropTypes.func,
  turn: PropTypes.object,
  units: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(BattleMapContainer)
