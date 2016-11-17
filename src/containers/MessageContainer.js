import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Button, IconButton} from 'react-toolbox/lib/button'
// import TextComponent from '../components/TextComponent/TextComponent'
// import ButtonComponent from '../components/ButtonComponent/ButtonComponent'

import { cancelMove,setAttackSquares, toggleAttackRange, finishUnit, confirmAttack } from '../actions/turnActions'
import { setActiveUnit } from '../actions/unitActions'

const mapStateToProps = (state) => {
  return {
    battle: state.battle,
    turn: state.turn,
    units: state.units
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelMove: () => {dispatch(cancelMove())},
    toggleAttackRange: (showValue) => {dispatch(toggleAttackRange())},
    clearActiveUnit: () => {dispatch(setActiveUnit(null))},
    finishUnit: () => {dispatch(finishUnit())},
    confirmAttack: () => {dispatch(confirmAttack())}
  }
}

class MessageContainer extends Component {
  constructor(props) {
    super(props)
  }

  _handleCancelMove() {
    // this.props.toggleAttackRange(false)
    // this.props.clearActiveUnit()
    this.props.cancelMove()
  }

  _renderCancelMoveButton() {
    if (this.props.battle.activeUnitMoved) {
      return (
        <Button
          label={"cancel move"}
          onMouseUp={this._handleCancelMove.bind(this)}
        />
      )
    }
    return null
  }

_renderAttackButton() {
  if (this.props.battle.activeUnitMoved && this.props.battle.validTarget) {
    if (this.props.battle.attackTarget && this.props.battle.attackTarget.valid) {
      return (
        <Button
          label={"confirm attack"}
          onMouseUp={this.props.finishUnit.bind(this, true)}
        />
      )
    }
    return (
      <Button
        label={!this.props.battle.showAttack ? "attack" : "cancel attack"}
        onMouseUp={this.props.toggleAttackRange.bind(this)}
      />
    )
  }
  return null
}

_renderWaitButton() {
  if (this.props.battle.activeUnitMoved) {
    return (
      <Button
        label={"wait"}
        onMouseUp={this.props.finishUnit.bind(this)}
      />
    )
  }
  return null
}

  render() {
    return (
      <div>
        {this._renderCancelMoveButton()}
        {this._renderAttackButton()}
        {this._renderWaitButton()}
      </div>
    )
  }
}

MessageContainer.propTypes = {
  activeUnit: PropTypes.object,
  battle: PropTypes.object,
  cancelMove: PropTypes.func,
  clearActiveUnit: PropTypes.func,
  confirmAttack: PropTypes.func,
  finishUnit: PropTypes.func,
  toggleAttackRange: PropTypes.func,
  turn: PropTypes.object,
  units: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageContainer)
