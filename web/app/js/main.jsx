import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {Router, Route, Redirect} from 'react-router';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {syncHistory, routeReducer} from 'react-router-redux';
const browserHistory = createBrowserHistory();

// Components
import App from './app';
import FinancesContainer from './containers/finances_container';
import RunningContainer from './containers/running_container';
// import HealthContainer from './health_container';
// import TimeContainer from './time_container';

// Reducers
import financesReducer from './reducers/finances_reducer';
import runningReducer from './reducers/running_reducer';

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(browserHistory);
const createStoreWithMiddleware = applyMiddleware(thunk, reduxRouterMiddleware)(createStore);

const reducer = combineReducers(_.assign({}, {
  routing: routeReducer,
  running: runningReducer,
  finances: financesReducer,
}));

const store = createStoreWithMiddleware(reducer);

// Required for replaying actions from devtools to work
reduxRouterMiddleware.listenForReplays(store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Redirect from='/' to='/finances' />
      <Route path='/' component={App}>
        <Route path='finances' component={FinancesContainer} />
        <Route path='running' component={RunningContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
