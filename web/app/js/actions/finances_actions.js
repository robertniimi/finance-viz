import ActionTypes from 'action_types';
import FinancesDao from '../dao/finances_dao';
import Promise from 'bluebird';
import ASYNC from 'async_status';

const ASYNC_ACTIONS = {
  changeTransactionCategory:  [ActionTypes.CHANGE_TRANSACTION_CATEGORY, FinancesDao.updateTransaction],
  fetchAccounts:              [ActionTypes.FETCH_ACCOUNTS,              FinancesDao.fetchAccounts],
  fetchCategories:            [ActionTypes.FETCH_CATEGORIES,            FinancesDao.fetchCategories],
  fetchChartTransactions:     [ActionTypes.FETCH_CHART_TRANSACTIONS,    FinancesDao.fetchChartTransactions,     'stackedAreaChart'],
  fetchNetIncome:             [ActionTypes.FETCH_NET_INCOME,            FinancesDao.fetchNetIncome,             'netIncomeChart'],
  fetchTransactions:          [ActionTypes.FETCH_TRANSACTIONS,          FinancesDao.fetchTransactions,          'transactions'],
};

const defaultSuccess = (result, actionType, propName) => {
  let action = {
    type: actionType,
    status: ASYNC.SUCCESS,
    result,
  };
  return (propName) ? Object.assign(action, {propName}) : action;
};

const defaultError = (error, actionType, propName) => {
  let action = {
    type: actionType,
    status: ASYNC.ERROR,
    result: error,
  };
  return (propName) ? Object.assign(action, {propName}) : action;
};

const defaultFetch = (actionType, propName) => {
  let action = {
    type: actionType,
    status: ASYNC.FETCHING,
  };
  return (propName) ? Object.assign(action, {propName}) : action;
};

let thunks = _.reduce(ASYNC_ACTIONS, (result, actionTuple, actionName) => {
  const [actionType, daoAction, propName] = actionTuple;
  result[actionName] = (...args) => {
    return (dispatch) => {
      dispatch(defaultFetch(actionType, propName));
      return daoAction.apply(null, args)
        .then((result) => {
          dispatch(defaultSuccess(result, actionType, propName));
        })
        .catch((err) => {
          dispatch(defaultError(err, actionType, propName));
        });
    }
  };
  return result;
}, {
  fetchBankAssets(dateRange) {
    return (dispatch) => {
      const type = ActionTypes.FETCH_BANK_ASSETS;
      dispatch(defaultFetch(type, 'netAssetsChart'));
      const props = {
        bankAssets: FinancesDao.fetchBankAssets(dateRange),
        investmentAssets: FinancesDao.fetchInvestmentAssets(dateRange),
        debts: FinancesDao.fetchDebts(dateRange),
      };
      return Promise.props(props)
        .then((result) => {
          dispatch(defaultSuccess(result, type, 'netAssetsChart'));
        })
        .catch((err) => {
          dispatch(defaultError(err, type, 'netAssetsChart'));
        });
    };
  },
});

const actions = {
  changeDateRange(selectedDateRange) {
    return {
      type: ActionTypes.CHANGE_DATE_RANGE,
      selectedDateRange,
    };
  },
  changeTableFilter(filter) {
    return {
      type: ActionTypes.CHANGE_TABLE_FILTER,
      filter,
    };
  },
};

module.exports = Object.assign({}, actions, thunks);
