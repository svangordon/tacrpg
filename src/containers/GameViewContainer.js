import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import {Grid, Row, Column} from 'react-cellblock'
import ReactGridLayout from 'react-grid-layout'

// import StatContainer from './StatContainer.js'
// import ImageContainer from '../ImageContainer/ImageContainer'
import MessageContainer from './MessageContainer'
import BattleMapContainer from './BattleMapContainer'
import StatComponent from '../components/StatComponent'

const mapStateToProps = (state) => {
  return {
    battle: state.battle
  }
}

class GameViewContainer extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const layout = [
      {i: 'attr',   x: 0, y: 0, w: 2, h: 6, static: true},
      {i: 'status', x: 0, y: 6, w: 2, h: 6, static: true},
      {i: 'image',  x: 2, y: 0, w: 6, h: 9, static: true},
      {i: 'msg',    x: 2, y: 9, w: 6, h: 3, static: true}
    ]
    return (
      <ReactGridLayout className="layout" cols={12} layout={layout} rowHeight={30} width={1200}>
        <div key="attr" style={{backgroundColor: 'blue'}}>
          {
            this.props.battle.attackTarget && this.props.battle.attackTarget.valid ? (
              this.props.battle.activeUnit.label + " vs " + this.props.battle.attackTarget.label
            ) : null
          }
        </div>
        <div key="status" style={{backgroundColor: 'red'}}>
          {
            this.props.battle.activeUnit ? (
              <StatComponent
                data={this.props.battle.activeUnit}
                title={"Turn"}
              />
            ) : null
          }
        </div>
        <div key="image" style={{backgroundColor: 'green'}}>
          <BattleMapContainer />
        </div>
        <div key="msg" style={{backgroundColor: 'yellow'}}>
          <MessageContainer />
        </div>
      </ReactGridLayout>
    )
  }
}

GameViewContainer.propTypes = {
  battle: PropTypes.object
}

export default connect(mapStateToProps)(GameViewContainer)
