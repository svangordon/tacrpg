import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
// import style from './style.scss'

import Navigation from 'react-toolbox/lib/navigation'
import Link from 'react-toolbox/lib/link'
import AppBar from 'react-toolbox/lib/app_bar'
import style from 'react-toolbox/lib/link/theme.scss'

// We've replaced link elements with buttons that use browserHistory to navigate
const actions = [
  { label: 'Home', icon: 'home', raised: false, accent:true, onMouseUp: () => {browserHistory.push('/')}},
  { label: 'Injury Tracker', icon: 'healing', raised: false, accent: true, onMouseUp: () => {browserHistory.push('/injurytracker')}}
]

class App extends Component {
  render() {
    return (
      <div>
        <AppBar flat>
          <h1 style={{float: 'right'}}>{"App Home"}</h1>
          <Navigation actions={actions} type='horizontal' />
        </AppBar>
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node
}

export default App
