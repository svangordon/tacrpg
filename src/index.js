import React from 'react'
import 'babel-polyfill'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { syncHistoryWithStore, routerReducer} from 'react-router-redux'
require('es6-promise').polyfill()

import App from './containers/app/index.js'
import Home from './containers/Home/Home.js'

import { customMiddleware, unitMiddleware, turnMiddleware, clickMiddleware } from './middleware/genericMiddleware'
import { aiMiddleware } from './middleware/aiMiddleware'
// import units from './reducers/unitsReducer'
import ai from './reducers/aiReducer'
import battle from './reducers/battleReducer'
import battleMap from './reducers/battleMapReducer'
import move from './reducers/moveReducer'
import turn from './reducers/turnReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const reducers = combineReducers({
  ai,
  battle,
  routing: routerReducer
})

const loggerMiddleware = createLogger()

const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      // loggerMiddleware,
      turnMiddleware,
      unitMiddleware,
      clickMiddleware,
      aiMiddleware
    )
  )
)

   //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const history = syncHistoryWithStore(browserHistory, store)

render((
    <Provider store={store}>
      <Router history={history}>
        <Route component={App} path="/">
          <IndexRoute component={Home} />
        </Route>
      </Router>
    </Provider>

), document.getElementById('app'))
