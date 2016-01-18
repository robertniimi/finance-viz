import moment from 'moment';
import update from 'react-addons-update';

// Constants
import ActionTypes from 'action_types';
import DateRanges from 'date_ranges';
import DisplayedAccountTypes from 'displayed_account_types';

// Daos
import FinancesDao from '../dao/finances_dao';

// const DEFAULT_DATE_RANGE = '1 Year';
const DEFAULT_DATE_RANGE = 'L12M';
const NET_ASSET_GOAL = 54137;

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
  netAssets: 0,
  accounts: [],
  transactions: defaultChartProps({query: 'category: Uncategorized'}),
  stackedAreaChart: defaultChartProps(),
  netAssetsChart: {
    bankAssets: defaultChartProps(),
    investmentAssets: defaultChartProps(),
    debts: defaultChartProps()
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
      console.log('[finances_reducer] @FETCH_TRANSACTIONS_SUCCESS -> action.transactions: ', action.transactions);
      let transactions = _.find(action.result.set, (setObj) => {
        return setObj.id === 'transactions';
      }).data;

      return update(state, {
        transactions: {
          data: { $set: transactions },
          $merge: defaultSuccess
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

    case ActionTypes.FETCH_CATEGORIES_SUCCESS:
      console.log('[finances_reducer] @FETCH_CATEGORIES_SUCCESS -> action.result: ', action.result);
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

      const { bankAssets, investmentAssets, debts } = action.result;

      let findLastMonthAssets = (trendList) => {
        return _.find(trendList, (assetObj, idx) => {
          let assetDate = moment(new Date(assetObj.startDate));
          let assetMonth = assetDate.month();
          let assetYear = assetDate.year();

          let currentDate = moment();
          let currentMonth = currentDate.month();
          let currentYear = currentDate.year();

          if (currentDate.month() === 0) {
            return (assetMonth === 11) && (assetYear === (currentYear - 1));
          } else {
            return (assetMonth === (currentMonth - 1)) && (assetYear === currentYear)
          }
        });
      }

      let lastMonthBankAssets = findLastMonthAssets(bankAssets.trendList);
      let lastMonthInvestmentAssets = findLastMonthAssets(investmentAssets.trendList);
      let lastMonthDebts = findLastMonthAssets(debts.trendList);

      let lastMonthBankAssetsValue = (lastMonthBankAssets) ? lastMonthBankAssets.value : 0;
      let lastMonthInvestmentAssetsValue = (lastMonthInvestmentAssets) ? lastMonthInvestmentAssets.value : 0;
      let lastMonthDebtsValue = (lastMonthDebts) ? lastMonthDebts.value : 0;

      let lastMonthNetAssets = lastMonthBankAssetsValue + lastMonthInvestmentAssetsValue - lastMonthDebtsValue;
      let netIncomeGoal = (NET_ASSET_GOAL - lastMonthNetAssets) / (12 - moment().month());

      return update(state, {
        netIncomeChart: {
          goal: { $set: netIncomeGoal }
        },
        netAssetsChart: {
          bankAssets: {
            data: { $set: bankAssets.trendList }
          },
          investmentAssets: {
            data: { $set: investmentAssets.trendList }
          },
          debts: {
            data: { $set: debts.trendList }
          }
        }
      });

    case ActionTypes.FETCH_ACCOUNTS_SUCCESS:
      console.log('[finances_reducer] @FETCH_ACCOUNTS_SUCCESS -> action.result: ', action.result);
      let accounts = action.result.response.accounts.response;
      let netAssets = _.reduce(accounts, (result, accountObj, idx) => {
        if (_.includes(DisplayedAccountTypes, accountObj.accountType) && accountObj.accountSystemStatus === 'ACTIVE') {
          return accountObj.value + result;
        }
        return result;
      }, 0);

      // let currentMonth = moment().month();
      // console.log('[finances_reducer] currentMonth: ', currentMonth);
      // let netIncomeGoal = (NET_ASSET_GOAL - netAssets) / (12 - currentMonth);
      // console.log('[finances_reducer] netIncomeGoal: ', netIncomeGoal);

      return update(state, {
        // netIncomeChart: {
        //   goal: { $set: netIncomeGoal }
        // },
        netAssets: { $set: netAssets },
        accounts: { $set: accounts }
      });

    case ActionTypes.CHANGE_TRANSACTION_CATEGORY_SUCCESS:
      console.log('[finances_reducer] @CHANGE_TRANSACTION_CATEGORY_SUCCESS -> action.result: ', action.result);
      return state;

    // ERRORS
    // ======
    case ActionTypes.FETCH_CHART_TRANSACTIONS_ERROR:
      console.error('[finances_reducer] @FETCH_CHART_TRANSACTIONS_ERROR -> action.error: ', action.error);
      return update(state, {
        stackedAreaChart: {
          $merge: defaultError(action.error)
        }
      });

    case ActionTypes.FETCH_TRANSACTIONS_ERROR:
      console.error('[finances_reducer] @FETCH_TRANSACTIONS_ERROR -> error: ', action.error);
      return update(state, {
        transactions: {
          $merge: defaultError(action.error)
        }
      });
    case ActionTypes.FETCH_ACCOUNTS_ERROR:
      console.log('[finances_reducer] @FETCH_ACCOUNTS_ERROR -> action.error: ', action.error);
    case ActionTypes.CHANGE_TRANSACTION_CATEGORY_ERROR:
      console.log('[finances_reducer] @CHANGE_TRANSACTION_CATEGORY_ERROR -> action.error: ', action.error);
    case ActionTypes.FETCH_BANK_ASSETS_ERROR:
      console.log('[finances_reducer] @FETCH_BANK_ASSETS_ERROR -> action.error: ', action.error);
    case ActionTypes.FETCH_NET_WORTH_ERROR:
      console.log('[finances_reducer] @FETCH_NET_WORTH_ERROR -> action.error: ', action.error);
    case ActionTypes.FETCH_NET_INCOME_ERROR:
      console.log('[finances_reducer] @FETCH_NET_INCOME_ERROR -> action.error: ', action.error);
    case ActionTypes.FETCH_CATEGORIES_ERROR:
      console.log('[finances_reducer] @FETCH_CATEGORIES_ERROR -> action.error: ', action.error);
      return state;


    default:
      return state;
    }
}

module.exports = financesReducer;
