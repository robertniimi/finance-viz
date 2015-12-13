import { createStore } from 'redux';
import personalApp from '../reducers/finances_reducer';
let store = createStore(personalApp);

console.log('[finances_store] store.getState(): ', store.getState());

// Every time the state changes, log it
let unsubscribe = store.subscribe(() =>
  console.log('[finances_store] store.getState(): ', store.getState());
);

import FinancesActions from '../actions/finances_actions';

console.log('[finances_store] FinancesActions: ', FinancesActions);


store.dispatch(getTransactions({
  query: 'category: Undefined'
}));


unsubscribe();
