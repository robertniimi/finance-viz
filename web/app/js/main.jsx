// import { applyMiddleware, createStore, combineReducers } from 'redux';
// import { syncHistory, routeReducer } from 'react-router-redux'
// import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';

// // Components
// import FinancesContainer from './finances_container';

// // Reducers
// import financesReducer from '../reducers/finances_reducer';

// const reducer = combineReducers(Object.assign({}, reducers, {
//   routing: routeReducer
// }));

// // Sync dispatched route actions to the history
// const reduxRouterMiddleware = syncHistory(browserHistory)
// const createStoreWithMiddleware = applyMiddleware(thunk, reduxRouterMiddleware)(createStore);

// const store = createStoreWithMiddleware(financesReducer);

// let unsubscribe = store.subscribe(() => {
//   // console.log('[app] store.getState(): ', store.getState());
// });

// class App extends React.Component {
//   render() {
//     return (
//       <Provider store={ store }>
//         <FinancesContainer />
//       </Provider>
//     );
//   }
// }

// module.exports = App;

import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';
import {syncHistory, routeReducer} from 'react-router-redux';
import thunk from 'redux-thunk';

// Components
import App from './app';
import FinancesContainer from './containers/finances_container';
// import HealthContainer from './health_container';
// import TimeContainer from './time_container';

// Reducers
import financesReducer from './reducers/finances_reducer';

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(browserHistory);
const createStoreWithMiddleware = applyMiddleware(thunk, reduxRouterMiddleware)(createStore);

const reducer = combineReducers(Object.assign({}, {
  routing: routeReducer,
  finances: financesReducer,
}));

const store = createStoreWithMiddleware(reducer);

// Required for replaying actions from devtools to work
// reduxRouterMiddleware.listenForReplays(store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="finances" component={FinancesContainer}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
