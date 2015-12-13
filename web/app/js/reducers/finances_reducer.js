import moment from 'moment';

// Constants
import ActionTypes from 'action_types';

const DATE_RANGES = {
  'All Time': null,
  '3 Months': moment().subtract(3, 'months').toISOString(),
  '6 Months': moment().subtract(6, 'months').toISOString(),
  '1 Year': moment().subtract(1, 'year').toISOString(),
  '2 Year': moment().subtract(2, 'years').toISOString()
};

const DEFAULT_DATE_RANGE = '1 Year';

const initialState = {
  transactions: [],
  chartData: [],
  dateRange: DEFAULT_DATE_RANGE,
  query: {
    end: (new Date()).toISOString(),
    start: DATE_RANGES[DEFAULT_DATE_RANGE]
  }
};

let _fetchTransactions = () => {

};

// do reducers modify the actual state?
function personalApp(state = initialState, action) {
  console.log('[finances_reducer] state: ', state);
  console.log('[finances_reducer] @personalApp -> action: ', action);
  switch (action.type) {
    case ActionTypes.CHANGE_DATE_RANGE:
      // modify date range here, then refetch
      return dateRange;

    case ActionTypes.FETCH_TRANSACTIONS:
      console.log('[finances_reducer] @personalApp.FETCH_TRANSACTIONS -> action: ', action);
      return;

    case ActionTypes.FETCH_TRANSACTIONS_SUCCESS:
      return;

    default:
      return state;
    }
}

module.exports = personalApp;
