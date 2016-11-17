import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Grid, Row, Column} from 'react-cellblock'
import LayerComponent from '../components/LayerComponent'
import { tileGetter } from '../utilities/mapConstructor'
import { clickTile } from '../actions/turnActions'
import PF from 'pathfinding'
import { setMovePath, setAttackTarget } from '../actions/turnActions'
import { coords } from '../utilities/UtilityContainer'

const mapStateToProps = (state) => {
  return {
    battle: state.battle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickTile: (tile) => {
      dispatch(clickTile(tile))
    },
    setAttackTarget: (tileId) => {
      dispatch(setAttackTarget({position: tileId}))
    },
    setMovePath: (path) => {
      dispatch(setMovePath(path))
    }
  }
}

class TileContainer extends Component {

  constructor(props) {
    super(props)
    // this.tileGetter = tileGetter.bind(this, props.battle.terrainmap)
  }

  _renderUnits() {
    let unit = this.props.battle.units.find(unit => unit.position === this.props.tile.id)
    if (unit && this.props.battle.activeUnit && unit.id === this.props.battle.activeUnit.id) {
      // don't render the active unit here
      unit = null
    }
    if (this.props.battle.activeUnit && this.props.tile.id === this.props.battle.activeUnit.position) {
      unit  = this.props.battle.activeUnit
    }
    if (unit) {
      if (this.props.battle.activeUnit && unit.id === this.props.battle.activeUnit.id) {
        console.log('bang')
      }
      console.log('unit.pos ==', unit.position)
      return (
        <LayerComponent
          key={"unit"}
          offset={unit.offset}
          spriteScale={this.props.spriteScale}
        />
      )
    }
    return null
  }

  // determines whether the square should render a move range square
  _renderMoveRange() {
    if (!this.props.battle.activeUnit
      || !this.props.battle.moveSquares
      || this.props.battle.showAttack
      || this.props.battle.activeUnitMoved) {
      return null
    }
    if (this.props.battle.moveSquares[this.props.tile.id].valid) {
      return (
        <LayerComponent
          key={"moveSquares"}
          offset={[-64, -672]}
          opacity={0.5}
          spriteScale={this.props.spriteScale}
        />
      )
    }
    return null
  }

  _renderMovePath() {
    if (
      this.props.battle.activeUnit
      && !this.props.battle.showAttack
      && this.props.battle.movePath
      && this.props.battle.movePath.some((path, i) => i !== 0 && String(coords(path).id) === String(this.props.tile.id))
    ) {
      return (
        <LayerComponent
          key={"movePath"}
          offset={[-64, -672]}
          opacity={1}
          spriteScale={this.props.spriteScale}
        />
      )
    }
    // if (this.props.battle.movePath)
    //   console.log(this.props.battle.movePath.map(xy => coords(xy)))
    return null
  }

  _renderAttackRange() {
    if (
      this.props.battle.showAttack
      // && this.props.battle.validTarget
      && this.props.battle.activeUnit
      && this.props.battle.attackSquares
      && this.props.battle.attackSquares[this.props.tile.id].valid
      // && this.props.battle.moveSquares[this.props.tile.id].path
      // && this.props.battle.moveSquares[this.props.tile.id].path.length - 2 < this.props.battle.activeUnit.range
    ) {
      // console.log(this.props.battle.attackSquares,this.props.tile.id,this.props.battle.attackSquares[this.props.tile.id])
      return (
        <LayerComponent
          key={"attackRange"}
          offset={[-48, -672]}
          opacity={1}
          spriteScale={this.props.spriteScale}
        />
      )
    }
    return null
  }

  _handleHover(tileId) {
    if (this.props.battle.activeUnit
      && !this.props.battle.showAttack
      && this.props.battle.moveSquares[tileId].valid
      && !this.props.battle.activeUnitMoved
    ) {
        this.props.setMovePath(this.props.battle.moveSquares[tileId].path.map(tile => coords(tile).id))
    }
    if (this.props.battle.showAttack && !this.props.battle.attackTarget.valid) {
      this.props.setAttackTarget(tileId)
    }
  }

  render() {
    return (
      <div
        onClick={this.props.handleClickTile.bind(this, this.props.tile.id)}
        onMouseOver={this._handleHover.bind(this, this.props.tile.id)}
      >
        {Object.keys(this.props.tile.layers).map(layerName => {
          return (
            <LayerComponent
              key={layerName}
              offset={this.props.tile.layers[layerName].offset}
              opacity={this.props.tile.layers[layerName].opacity}
              spriteScale={this.props.spriteScale}
            />
          )
        })}
      </div>
    )
  }
}

TileContainer.propTypes = {
  battle: PropTypes.object,
  handleClickTile: PropTypes.func,
  setAttackTarget: PropTypes.func,
  setMovePath: PropTypes.func,
  spriteScale: PropTypes.number,
  tile: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(TileContainer)
