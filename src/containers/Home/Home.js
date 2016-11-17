import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import style from './style.css'
import GameViewContainer from '../GameViewContainer'

const mapStateToProps = (state) => {
  return {
    test: state.test
  }
}

class Home extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <GameViewContainer />
    )
  }
}

Home.propTypes = {
  playersActions: PropTypes.object
}

export default connect(mapStateToProps)(Home)
