import moment from 'moment';
import update from 'react-addons-update';

// Constants
import ActionTypes from 'action_types';
import DATE_RANGES from 'date_ranges';
import DisplayedAccountTypes from 'displayed_account_types';

// DAOs
// import FinancesDao from '../dao/finances_dao';

// Constants
const DEFAULT_DATE_RANGE = 'L12M'; // Last 12 Months
const NET_ASSET_GOAL = 54137; // net asset goal for the end of 2016
const DEFAULT_TRANSACTION_QUERY = '';
const ASYNC = (() => {
  const statuses = {
    SUCCESS: 'success',
    FETCHING: 'fetching',
    ERROR: 'error',
  };

  const checks = {
    isSuccess(status) {
      return status === statuses.SUCCESS;
    },
    isFetching(status) {
      return status === statuses.FETCHING;
    },
    isError(status) {
      return status === statuses.ERROR;
    },
  };

  return Object.assign({}, statuses, checks);
})();

const {isSuccess} = ASYNC;

const defaultAsyncProps = (props) => {
  let defaultProps = {
    data: [],
    loading: false,
    error: false,
  };

  return Object.assign({}, defaultProps, props || {});
};

const defaultFetching = {
  loading: true,
  error: false,
};

const defaultSuccess = (result) => {
  return {
    data: result,
    error: false,
    loading: false,
  };
};

const defaultError = (error) => {
  return {
    loading: false,
    error,
  };
};

const findDateRange = (rangeValue) => {
  return _.find(DATE_RANGES, (range) => range.value === rangeValue);
};

const initialState = {
  netAssets: 0,
  accounts: [],
  transactions: defaultAsyncProps({query: DEFAULT_TRANSACTION_QUERY}),
  stackedAreaChart: defaultAsyncProps(),
  netAssetsChart: {
    bankAssets: defaultAsyncProps(),
    investmentAssets: defaultAsyncProps(),
    debts: defaultAsyncProps(),
  },
  netIncomeChart: defaultAsyncProps({goal: 0}),
  categories: [],
  dateRange: findDateRange(DEFAULT_DATE_RANGE),
};

const defaultFetchHandler = (state, propName, result, status, actionType) => {
  if (actionType === 'FETCH_TRANSACTIONS') {
    console.log('[finances_reducer] propName: ', propName);
    console.log('[finances_reducer] result: ', result);
    console.log('[finances_reducer] status: ', status);
  };
  const {ERROR, SUCCESS, FETCHING} = ASYNC;
  switch (status) {
    case ERROR:
      console.error(`[FinancesReducer] @${actionType} -> error: `, result);
      return update(state, {
        [propName]: {$merge: defaultError(result)},
      });
    case SUCCESS:
      return update(state, {
        [propName]: {$merge: defaultSuccess(result)},
      });
    case FETCHING:
      return update(state, {
        [propName]: {$merge: defaultFetching},
      });
    default:
      return state;
  }
};


function financesReducer(state = initialState, action) {
  // console.log('[finances_reducer] @financesReducer -> action: ', action);
  switch (action.type) {
    case ActionTypes.CHANGE_DATE_RANGE:
      let dateRange = findDateRange(action.selectedDateRange);
      return update(state, {
        dateRange: {$set: dateRange},
      });

    case ActionTypes.CHANGE_TABLE_FILTER:
      return update(state, {
        transactions: {
          query: {$set: action.filter},
        },
      });

    // ASYNC ACTIONS
    case ActionTypes.FETCH_TRANSACTIONS:
      console.log('[finances_reducer] @FETCH_TRANSACTIONS -> action: ', action);
      if (isSuccess(action.status)) {
        console.log('[finances_reducer] @FETCH_TRANSACTIONS_SUCCESS -> action.result: ', action.result);
        const result = _.find(action.result.set, (setObj) => {
          return setObj.id === 'transactions';
        }).data;

        console.log('[finances_reducer] @FETCH_TRANSACTIONS -> result: ', result);
        return defaultFetchHandler(state, action.propName, result, action.status, action.type);
      }

    case ActionTypes.FETCH_CATEGORIES:
      if (isSuccess(action.status)) {
        // console.log('[finances_reducer] @FETCH_CATEGORIES_SUCCESS -> action.result: ', action.result);
        let categories = _.find(action.result.set, (setObj) => {
          return setObj.id === 'categories';
        }).data;

        return update(state, {
          categories: {$set: categories},
        });
      }

    case ActionTypes.FETCH_NET_INCOME:
      if (isSuccess(action.status)) {
        // console.log('[finances_reducer] @FETCH_NET_INCOME_SUCCESS -> action.result: ', action.result);
        return update(state, {
          netIncomeChart: {
            startDate: {$set: moment(action.result.startDate)},
            endDate: {$set: moment(action.result.endDate)},
            $merge: defaultSuccess(action.result.trendList),
          },
        });
      };

    case ActionTypes.FETCH_BANK_ASSETS:
      if (isSuccess(action.status)) {
        // console.log('[finances_reducer] @FETCH_BANK_ASSETS_SUCCESS -> action.result: ', action.result);

        const {bankAssets, investmentAssets, debts} = action.result;

        let findLastMonthAssets = (trendList) => {
          return _.find(trendList, (assetObj) => {
            let assetDate = moment(new Date(assetObj.startDate));
            let assetMonth = assetDate.month();
            let assetYear = assetDate.year();

            let currentDate = moment();
            let currentMonth = currentDate.month();
            let currentYear = currentDate.year();

            if (currentDate.month() === 0) {
              return (assetMonth === 11) && (assetYear === (currentYear - 1));
            } else {
              return (assetMonth === (currentMonth - 1)) && (assetYear === currentYear);
            }
          });
        };

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
            goal: {$set: netIncomeGoal},
          },
          netAssetsChart: {
            bankAssets: {
              data: {$set: bankAssets.trendList},
            },
            investmentAssets: {
              data: {$set: investmentAssets.trendList},
            },
            debts: {
              data: {$set: debts.trendList},
            },
          },
        });
      }

    case ActionTypes.FETCH_ACCOUNTS:
      if (isSuccess(action.status)) {
        // console.log('[finances_reducer] @FETCH_ACCOUNTS_SUCCESS -> action.result: ', action.result);
        let accounts = _.filter(action.result.response.accounts.response, (accountObj) => {
          return _.includes(DisplayedAccountTypes, accountObj.accountType) && accountObj.accountSystemStatus === 'ACTIVE';
        });

        let netAssets = _.reduce(accounts, (result, accountObj) => {
          return accountObj.value + result;
        }, 0);

        return update(state, {
          netAssets: {$set: netAssets},
          accounts: {$set: accounts},
        });
      };

    case ActionTypes.CHANGE_TRANSACTION_CATEGORY:
      if (isSuccess(action.status)) {
        // console.log('[finances_reducer] @CHANGE_TRANSACTION_CATEGORY_SUCCESS -> action.result: ', action.result);
        return state;
      };

    // case ActionTypes.FETCH_TRANSACTIONS:
    case ActionTypes.FETCH_CHART_TRANSACTIONS:
    // case ActionTypes.FETCH_NET_INCOME:
      return defaultFetchHandler(state, action.propName, action.result, action.status, action.type);

    default:
      return state;
  }
}

module.exports = financesReducer;
