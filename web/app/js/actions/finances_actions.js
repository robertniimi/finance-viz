import ActionTypes from 'action_types';
import FinancesDao from '../dao/finances_dao';
import Promise from 'bluebird';

const ASYNC_ACTIONS = {
  'fetchTransactions': 'FETCH_TRANSACTIONS',
  'fetchChartTransactions': 'FETCH_CHART_TRANSACTIONS',
  'fetchCategories': 'FETCH_CATEGORIES',
  'fetchNetIncome': 'FETCH_NET_INCOME',
  'changeTransactionCategory': 'CHANGE_TRANSACTION_CATEGORY',
  'fetchBankAssets': 'FETCH_BANK_ASSETS',
  'fetchAccounts': 'FETCH_ACCOUNTS',
};

const asyncActions = _.reduce(ASYNC_ACTIONS, (result, actionType, actionName) => {
  // const [actionName, actionType] = action
  // result[actionName] = () => {
  //   return {
  //     type: ActionTypes[actionType],
  //     status: 'fetching',
  //   };
  // };
  result[actionName + 'Success'] = (result) => {
    return {
      type: ActionTypes[actionType + '_SUCCESS'],
      status: 'success',
      result,
    };
  };
  result[actionName + 'Error'] = (error) => {
    return {
      type: ActionTypes[actionType + '_ERROR'],
      status: 'error',
      result: error,
    }
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
    // return (dispatch) => {
    //   dispatch(asyncActions.changeTransactionCategory());
    //   return FinancesDao.updateTransaction(transaction, category)
    //     .then((result) => {
    //       dispatch(asyncActions.changeTransactionCategorySuccess(result));
    //     })
    //     .catch((err) => {
    //       dispatch(asyncActions.changeTransactionCategoryError(err));
    //     });
    // };
  },
  fetchCategories() {
    return defaultThunk(FinancesDao.fetchCategories, 'fetchCategories', []);
    // return (dispatch) => {
    //   dispatch(asyncActions.fetchCategories());
    //   return FinancesDao.fetchCategories()
    //     .then((result) => {
    //       dispatch(asyncActions.fetchCategoriesSuccess(result));
    //     })
    //     .catch((err) => {
    //       dispatch(asyncActions.fetchCategoriesError(err));
    //     });
    // };
  },
  fetchChartTransactions(query) {
    const args = arguments;
    return defaultThunk(FinancesDao.fetchChartTransactions, 'fetchChartTransactions', args);
    // return (dispatch) => {
    //   dispatch(() => {
    //     return {
    //       type: ActionTypes[actionType],
    //       status: 'fetching',
    //     }
    //   })
    //   return FinancesDao.fetchChartTransactions(query)
    //     .then((result) => {
    //       dispatch(asyncActions.fetchChartTransactionsSuccess(result));
    //     })
    //     .catch((err) => {
    //       dispatch(asyncActions.fetchChartTransactionsError(err));
    //     });
    // };
  },
  fetchTransactions(query) {
    const args = arguments;
    return defaultThunk(FinancesDao.fetchTransactions, 'fetchTransactions', args);
    // return (dispatch) => {
    //   dispatch(asyncActions.fetchTransactions());
    //   return FinancesDao.fetchTransactions(query)
    //     .then((result) => {
    //       dispatch(asyncActions.fetchTransactionsSuccess(result));
    //     })
    //     .catch((err) => {
    //       dispatch(asyncActions.fetchTransactionsError(err));
    //     });
    // };
  },
  fetchNetIncome(dateRange) {
    const args = arguments;
    return defaultThunk(FinancesDao.fetchNetIncome, 'fetchNetIncome', args);
    // return (dispatch) => {
    //   dispatch(asyncActions.fetchNetIncome());
    //   return FinancesDao.fetchNetIncome(dateRange)
    //     .then((result) => {
    //       dispatch(asyncActions.fetchNetIncomeSuccess(result));
    //     })
    //     .catch((err) => {
    //       dispatch(asyncActions.fetchNetIncomeError(err));
    //     });
    // };
  },
  fetchAccounts() {
    return defaultThunk(FinancesDao.fetchAccounts, 'fetchAccounts', []);
    // return (dispatch) => {
    //   dispatch(asyncActions.fetchAccounts());
    //   return FinancesDao.fetchAccounts()
    //     .then((result) => {
    //       dispatch(asyncActions.fetchAccountsSuccess(result));
    //     })
    //     .catch((err) => {
    //       dispatch(asyncActions.fetchAccountsError(err));
    //     });
    // };
  },
  fetchBankAssets(dateRange) {
    const args = arguments;
    // return defaultThunk(FinancesDao.fetch, 'changeTransactionCategory', args);
    return (dispatch) => {
    //   dispatch(asyncActions.fetchBankAssets());
      this.dispatch();
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
