import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import PersonalApp from './personal_app';
import reducers from '../reducers/finances_reducer';

const reducer = combineReducers([reducers]);
const store = createStore(reducer);

class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <PersonalApp />
      </Provider>
    );
  }
}

module.exports = App;
