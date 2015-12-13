import moment from 'moment';
import update from 'react-addons-update';

// Constants
import ActionTypes from 'action_types';

// Daos
import FinancesDao from '../dao/finances_dao';

const DATE_RANGES = {
  'All Time': null,
  '3 Months': moment().subtract(3, 'months').toISOString(),
  '6 Months': moment().subtract(6, 'months').toISOString(),
  '1 Year': moment().subtract(1, 'year').toISOString(),
  '2 Year': moment().subtract(2, 'years').toISOString()
};

const DEFAULT_DATE_RANGE = '1 Year';

const initialState = {
  transactions: {
    data: [],
    loading: false,
    error: false
  },
  stackedAreaChart: {
    data: [],
    loading: false,
    error: false
  },
  // transactions: [],
  chartData: [],
  selectedDateRange: DEFAULT_DATE_RANGE,
  dateRange: {
    end: (new Date()).toISOString(),
    start: DATE_RANGES[DEFAULT_DATE_RANGE]
  }
};

let _fetchTransactions = () => {

};

// do reducers modify the actual state?
function financesReducer(state = initialState, action) {
  console.log('[finances_reducer] @financesReducer -> action: ', action);
  switch (action.type) {
    case ActionTypes.CHANGE_DATE_RANGE:
      // modify date range here, then refetch
      return update(state, {
        selectedDateRange: { $set: action.selectedDateRange }
      });

    case ActionTypes.FETCH_TRANSACTIONS:
      console.log('[finances_reducer] @FETCH_TRANSACTIONS');
      // FinancesDao.fetchTransactions(action.query, action.success, action.failure);
      FinancesDao.fetchTransactions(action.query)
        .then((transactions) => {
          console.log('[finances_reducer] @FETCH_TRANSACTIONS -> transactions: ', transactions);
          let { data } = _.find(transactions.set, (setObj) => {
            return setObj.id === 'transactions';
          });
          action.success(data);
        })
        .catch((error) => {
          action.failure(error);
        });

      return update(state, {
        transactions: {
          loading: { $set: true }
        }
      });

    case ActionTypes.FETCH_TRANSACTIONS_SUCCESS:
      console.log('[finances_reducer] @FETCH_TRANSACTIONS_SUCCESS -> action.transactions: ', action.transactions);
      return update(state, {
        transactions: {
          data: { $set: action.transactions },
          loading: { $set: false }
        }
      });

    case ActionTypes.FETCH_TRANSACTIONS_ERROR:
      console.error('[finances_reducer] @FETCH_TRANSACTIONS_ERROR -> error: ', action.error);
      return update(state, {
        transactions: {
          loading: { $set: false },
          error: { $set: action.error }
        }
      });

    case ActionTypes.FETCH_CHART_TRANSACTIONS:
      console.log('[finances_reducer] @FETCH_CHART_TRANSACTIONS');
      // FinancesDao.fetchChartTransactions(action.query, action.success, action.failure);
      FinancesDao.fetchChartTransactions(action.query)
        .then((transactions) => {
          console.log('[finances_reducer] @FETCH_CHART_TRANSACTIONS -> transactions: ', transactions);
          let { data } = _.find(transactions.set, (setObj) => {
            return setObj.id === 'transactions';
          });
          action.success(data);
        })
        .catch((error) => {
          action.failure(error);
        });

      return update(state, {
        stackedAreaChart: {
          loading: { $set: true }
        }
      });

    case ActionTypes.FETCH_CHART_TRANSACTIONS_SUCCESS:
      // console.log('[finances_reducer] @FETCH_CHART_TRANSACTIONS_SUCCESS -> action.transactions: ', action.transactions);
      return update(state, {
        stackedAreaChart: {
          data: { $set: action.transactions },
          loading: { $set: false }
        }
      });

    case ActionTypes.FETCH_CHART_TRANSACTIONS_ERROR:
      console.error('[finances_reducer] @FETCH_CHART_TRANSACTIONS_ERROR -> error: ', action.error);
      return update(state, {
        stackedAreaChart: {
          loading: { $set: false },
          error: { $set: action.error }
        }
      });

    default:
      return state;
    }
}

module.exports = financesReducer;
