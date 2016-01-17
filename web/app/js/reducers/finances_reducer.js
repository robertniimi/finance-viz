import moment from 'moment';
import update from 'react-addons-update';

// Constants
import ActionTypes from 'action_types';
import DateRanges from 'date_ranges';

// Daos
import FinancesDao from '../dao/finances_dao';

// const DEFAULT_DATE_RANGE = '1 Year';
const DEFAULT_DATE_RANGE = 'L12M';

let findDateRange = (rangeValue) => {
  return _.find(DateRanges, (range) => range.value === rangeValue);
};

const defaultChartProps = (props) => {
  let defaultProps = {
    data: [],
    loading: false,
    error: false
  };

  return _.assign({}, defaultProps, props || {});
};

const defaultSuccess = {
  loading: false,
  error: false
};

const defaultError = (error) => {
  return {
    loading: false,
    error
  };
};

const initialState = {
  accounts: [],
  transactions: defaultChartProps({query: 'category: Uncategorized'}),
  stackedAreaChart: defaultChartProps(),
  netAssetsChart: {
    bankAssets: defaultChartProps(),
    investmentAssets: defaultChartProps()
  },
  netIncomeChart: defaultChartProps({ goal: 2917 }),
  categories: [],
  dateRange: findDateRange(DEFAULT_DATE_RANGE)
};

function financesReducer(state = initialState, action) {
  // console.log('[finances_reducer] @financesReducer -> action: ', action);
  switch (action.type) {
    case ActionTypes.CHANGE_DATE_RANGE:
      let dateRange = findDateRange(action.selectedDateRange);
      return update(state, {
        dateRange: { $set: dateRange }
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
          $merge: defaultSuccess
        }
      });

    case ActionTypes.FETCH_TRANSACTIONS_ERROR:
      console.error('[finances_reducer] @FETCH_TRANSACTIONS_ERROR -> error: ', action.error);
      return update(state, {
        transactions: {
          $merge: defaultError(action.error)
        }
      });

    case ActionTypes.FETCH_CHART_TRANSACTIONS_SUCCESS:
      console.log('[finances_reducer] @FETCH_CHART_TRANSACTIONS_SUCCESS -> action.result: ', action.result);
      return update(state, {
        stackedAreaChart: {
          data: { $set: action.result },
          $merge: defaultSuccess
        }
      });

    case ActionTypes.FETCH_CHART_TRANSACTIONS_ERROR:
      console.error('[finances_reducer] @FETCH_CHART_TRANSACTIONS_ERROR -> error: ', action.error);
      return update(state, {
        stackedAreaChart: {
          $merge: defaultError(action.error)
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
      return update(state, {
        netIncomeChart: {
          startDate: { $set: moment(action.result.startDate) },
          endDate: { $set: moment(action.result.endDate) },
          data: { $set: action.result.trendList },
          $merge: defaultSuccess
        }
      });

    case ActionTypes.FETCH_NET_WORTH_SUCCESS:
      console.log('[finances_reducer] @FETCH_NET_WORTH_SUCCESS -> action.result: ', action.result);
      return state;

    case ActionTypes.FETCH_BANK_ASSETS_SUCCESS:
      console.log('[finances_reducer] @FETCH_BANK_ASSETS_SUCCESS -> action.result: ', action.result);
      return update(state, {
        netAssetsChart: {
          bankAssets: {
            data: { $set: action.result.bankAssets.trendList }
          },
          investmentAssets: {
            data: { $set: action.result.investmentAssets.trendList }
          }
        }
      });

    case ActionTypes.FETCH_ACCOUNTS_SUCCESS:
      console.log('[finances_reducer] @FETCH_ACCOUNTS_SUCCESS -> action.result: ', action.result);
      return update(state, {
        accounts: { $set: action.result.response.accounts.response }
      });

    case ActionTypes.FETCH_ACCOUNTS_ERROR:
      return state;

    case ActionTypes.CHANGE_TRANSACTION_CATEGORY_SUCCESS:
      console.log('[finances_reducer] @CHANGE_TRANSACTION_CATEGORY_SUCCESS -> action.result: ', action.result);
      return state;

    case ActionTypes.CHANGE_TRANSACTION_CATEGORY_ERROR:
      console.log('[finances_reducer] @CHANGE_TRANSACTION_CATEGORY_ERROR -> action.error: ', action.error);
      return state;

    case ActionTypes.FETCH_BANK_ASSETS_ERROR:
      console.log('[finances_reducer] @FETCH_BANK_ASSETS_ERROR -> action.error: ', action.error);
      return state;

    case ActionTypes.FETCH_NET_WORTH_ERROR:
      return state;

    case ActionTypes.FETCH_NET_INCOME_ERROR:
      return state;

    case ActionTypes.FETCH_CATEGORIES_ERROR:
      return state;


    default:
      return state;
    }
}

module.exports = financesReducer;
