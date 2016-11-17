import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import StatComponent from '../components/StatComponent'

class StatContainer extends Component {
  constructor(props) {
    super(props)
    this.titles = {
      "attr": "Attributes",
      "status": "Status"
    }
  }

  render() {
    return (
      <StatComponent
        data={this.props.player[this.props.type]}
        title={this.titles[this.props.type]}
      />
    )
  }
}

StatContainer.propTypes = {
  type: PropTypes.string
}

export default StatContainer
