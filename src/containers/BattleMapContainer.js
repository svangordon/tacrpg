import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import ReactGridLayout                  from 'react-grid-layout'
import PF                               from 'pathfinding'

import { setActiveUnit, moveUnit, syncUnits }      from '../actions/unitActions'
import { setAttack, setPfMap }       from '../actions/turnActions'
import BattleMapTileComponent           from '../components/BattleMapTileComponent'
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
    // setActiveUnit: unit => {
    //   dispatch(setActiveUnit(unit))
    // },
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.battle.needsSync) {
      this.props.syncUnits()
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
  setActiveUnit: PropTypes.func,
  setAttack: PropTypes.func,
  setPfMap: PropTypes.func,
  syncUnits: PropTypes.func,
  turn: PropTypes.object,
  units: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(BattleMapContainer)
