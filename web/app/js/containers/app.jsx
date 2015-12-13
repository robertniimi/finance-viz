import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

// Components
import FinancesContainer from './finances_container';

// Reducers
import financesReducer from '../reducers/finances_reducer';

const store = createStore(financesReducer);

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
