import moment from 'moment';
import update from 'react-addons-update';

// Constants
import ActionTypes from 'action_types';

// Daos
import FinancesDao from '../dao/finances_dao';

const DEFAULT_DATE_RANGE = '1 Year';
const DATE_RANGES = {
  'All Time': null,
  '3 Months': moment().subtract(3, 'months').toISOString(),
  '6 Months': moment().subtract(6, 'months').toISOString(),
  '1 Year': moment().subtract(1, 'year').toISOString(),
  '2 Year': moment().subtract(2, 'years').toISOString()
};

const initialState = {
  transactions: {
    data: [],
    loading: false,
    error: false,
    query: 'category: Uncategorized'
  },
  stackedAreaChart: {
    data: [],
    loading: false,
    error: false
  },
  lineChart: {
    netIncome: {
      data: [],
      loading: false,
      error: false
    },
    netWorth: {
      data: [],
      loading: false,
      error: false
    }
  },
  categories: [],
  selectedDateRange: DEFAULT_DATE_RANGE,
  dateRange: {
    end: (new Date()).toISOString(),
    start: DATE_RANGES[DEFAULT_DATE_RANGE]
  }
};

function financesReducer(state = initialState, action) {
  console.log('[finances_reducer] @financesReducer -> action: ', action);
  switch (action.type) {
    case ActionTypes.CHANGE_DATE_RANGE:
      // modify date range here, then refetch
      return update(state, {
        selectedDateRange: { $set: action.selectedDateRange },
        dateRange: {
          start: { $set: DATE_RANGES[action.selectedDateRange] }
        }
      });

    case ActionTypes.CHANGE_TABLE_FILTER:
      return update(state, {
        transactions: {
          query: { $set: action.filter }
        }
      });

    case ActionTypes.FETCH_TRANSACTIONS_SUCCESS:
      // console.log('[finances_reducer] @FETCH_TRANSACTIONS_SUCCESS -> action.transactions: ', action.transactions);
      let transactions = _.find(action.result.set, (setObj) => {
        return setObj.id === 'transactions';
      }).data;

      return update(state, {
        transactions: {
          data: { $set: transactions },
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

    case ActionTypes.FETCH_CATEGORIES_SUCCESS:
      // console.log('[finances_reducer] @FETCH_CATEGORIES_SUCCESS -> action.result: ', action.result);
      let categories = _.find(action.result.set, (setObj) => {
        return setObj.id === 'categories';
      }).data;

      return update(state, {
        categories: { $set: categories }
      });

    case ActionTypes.FETCH_NET_INCOME_SUCCESS:
      console.log('[finances_reducer] @FETCH_NET_INCOME_SUCCESS -> action.result: ', action.result);
      return state;

    case ActionTypes.FETCH_NET_WORTH_SUCCESS:
      console.log('[finances_reducer] @FETCH_NET_WORTH_SUCCESS -> action.result: ', action.result);
      return state;

    case ActionTypes.FETCH_NET_WORTH_ERROR:
      return state;

    case ActionTypes.FETCH_NET_INCOME_ERROR:
      return state;

    case ActionTypes.FETCH_CATEGORIES_ERROR:
      return state;

    case ActionTypes.CHANGE_TRANSACTION_CATEGORY_SUCCESS:
      console.log('[finances_reducer] @CHANGE_TRANSACTION_CATEGORY_SUCCESS -> action.result: ', action.result);
      return state;

    case ActionTypes.CHANGE_TRANSACTION_CATEGORY_ERROR:
      console.log('[finances_reducer] @CHANGE_TRANSACTION_CATEGORY_ERROR -> action.error: ', action.error);
      return state;

    default:
      return state;
    }
}

module.exports = financesReducer;
