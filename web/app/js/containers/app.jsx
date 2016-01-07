import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

// Components
import FinancesContainer from './finances_container';

// Reducers
import financesReducer from '../reducers/finances_reducer';

// const store = createStore(financesReducer);

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(financesReducer);

// console.log('[app] store.getState(): ', store.getState());

let unsubscribe = store.subscribe(() => {
  // console.log('[app] store.getState(): ', store.getState());
});

class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <FinancesContainer />
      </Provider>
    );
  }
}

module.exports = App;
