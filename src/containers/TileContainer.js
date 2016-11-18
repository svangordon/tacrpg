import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Grid, Row, Column} from 'react-cellblock'
import LayerComponent from '../components/LayerComponent'
import { tileGetter } from '../utilities/mapConstructor'
import { clickTile, setAttackTarget } from '../actions/turnActions'
// import PF from 'pathfinding'
import { setMovePath } from '../actions/turnActions'
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
      dispatch(setAttackTarget(tileId))
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

  _handleHover(tileId) {
    if (this.props.battle.activeUnit
      && !this.props.battle.showAttack
      && this.props.battle.moveSquares[tileId].valid
      && !this.props.battle.activeUnitMoved
    ) {
        // this.props.setMovePath(this.props.battle.moveSquares[tileId].path.map(tile => coords(tile).id))
        // just send the destination square, we can figure out the movepath
        this.props.setMovePath(tileId)
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
