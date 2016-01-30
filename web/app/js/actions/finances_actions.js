import ActionTypes from 'action_types';
import FinancesDao from '../dao/finances_dao';
import Promise from 'bluebird';

const ASYNC_ACTIONS = {
  fetchTransactions: [ActionTypes.FETCH_TRANSACTIONS, 'transactions'],
  fetchChartTransactions: [ActionTypes.FETCH_CHART_TRANSACTIONS, 'stackedAreaChart'],
  fetchCategories: [ActionTypes.FETCH_CATEGORIES],
  fetchNetIncome: [ActionTypes.FETCH_NET_INCOME, 'netIncomeChart'],
  changeTransactionCategory: [ActionTypes.CHANGE_TRANSACTION_CATEGORY],
  fetchBankAssets: [ActionTypes.FETCH_BANK_ASSETS, 'netAssetsChart'],
  fetchAccounts: [ActionTypes.FETCH_ACCOUNTS],
};

const asyncActions = _.reduce(ASYNC_ACTIONS, (result, actionTuple, actionName) => {
  const [actionType, propName] = actionTuple;
  const type = ActionTypes[actionType];
  result[actionName + 'Success'] = (result) => {
    let action = {
      type,
      status: 'success',
      result,
    };
    return (propName) ? Object.assign(action, {propName}) : action;
  };
  result[actionName + 'Error'] = (error) => {
    let action = {
      type,
      status: 'error',
      result: error,
    };
    return (propName) ? Object.assign(action, {propName}) : action;
  };
  return result;
}, {});

console.log('[finances_actions] asyncActions: ', asyncActions);

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

const dispatchDefaultFetch = (dispatch, actionName) => {
  dispatch(() => {
    return {
      type: ASYNC_ACTIONS[actionName],
      status: 'fetching',
    };
  });
};

const defaultThunk = (daoAction, actionName, args) => {
  return (dispatch) => {
    dispatchDefaultFetch.call(null, dispatch, actionName);
    return daoAction.apply(null, args)
      .then((result) => {
        dispatch(asyncActions[actionName + 'Success'](result));
      })
      .catch((err) => {
        dispatch(asyncActions[actionName + 'Error'](err));
      });
  };
}

const thunks = {
  changeTransactionCategory(transaction, category) {
    const args = arguments;
    console.log('[finances_actions] @changeTransactionCategory -> args: ', args);
    return defaultThunk(FinancesDao.updateTransaction, 'changeTransactionCategory', args);
  },
  fetchCategories() {
    return defaultThunk(FinancesDao.fetchCategories, 'fetchCategories', []);
  },
  fetchChartTransactions(query) {
    const args = arguments;
    return defaultThunk(FinancesDao.fetchChartTransactions, 'fetchChartTransactions', args);
  },
  fetchTransactions(query) {
    const args = arguments;
    return defaultThunk(FinancesDao.fetchTransactions, 'fetchTransactions', args);
  },
  fetchNetIncome(dateRange) {
    const args = arguments;
    return defaultThunk(FinancesDao.fetchNetIncome, 'fetchNetIncome', args);
  },
  fetchAccounts() {
    return defaultThunk(FinancesDao.fetchAccounts, 'fetchAccounts', []);
  },
  fetchBankAssets(dateRange) {
    const args = arguments;
    // return defaultThunk(FinancesDao.fetch, 'changeTransactionCategory', args);
    return (dispatch) => {
    //   dispatch(asyncActions.fetchBankAssets());
      const props = {
        bankAssets: FinancesDao.fetchBankAssets(dateRange),
        investmentAssets: FinancesDao.fetchInvestmentAssets(dateRange),
        debts: FinancesDao.fetchDebts(dateRange),
      };
      return Promise.props(props)
        .then((result) => {
          dispatch(asyncActions.fetchBankAssetsSuccess(result));
        })
        .catch((err) => {
          dispatch(asyncActions.fetchBankAssetsError(err));
        });
    };
  },
};

console.log('[finances_actions] thunks: ', thunks);

module.exports = _.assign({}, asyncActions, actions, thunks);
