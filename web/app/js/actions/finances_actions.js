import ActionTypes from 'action_types';
import FinancesDao from '../dao/finances_dao';
import Promise from 'bluebird';

let actions = {
  fetchTransactionsSuccess: (result) => {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS_SUCCESS,
      result
    };
  },
  fetchTransactionsError: (error) => {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS_ERROR,
      error
    };
  },
  fetchChartTransactionsSuccess: (result) => {
    return {
      type: ActionTypes.FETCH_CHART_TRANSACTIONS_SUCCESS,
      result
    };
  },
  fetchChartTransactionsError: (error) => {
    return {
      type: ActionTypes.FETCH_CHART_TRANSACTIONS_ERROR,
      error
    };
  },
  fetchCategoriesSuccess: (result) => {
    return {
      type: ActionTypes.FETCH_CATEGORIES_SUCCESS,
      result
    };
  },
  fetchCategoriesError: (error) => {
    return {
      type: ActionTypes.FETCH_CATEGORIES_ERROR,
      error
    };
  },
  changeDateRange: (selectedDateRange) => {
    return {
      type: ActionTypes.CHANGE_DATE_RANGE,
      selectedDateRange
    };
  },
  changeTableFilter: (filter) => {
    return {
      type: ActionTypes.CHANGE_TABLE_FILTER,
      filter
    }
  },
  fetchNetIncomeSuccess: (result) => {
    return {
      type: ActionTypes.FETCH_NET_INCOME_SUCCESS,
      result
    }
  },
  fetchNetIncomeError: (error) => {
    return {
      type: ActionTypes.FETCH_NET_INCOME_ERROR,
      error
    }
  },
  fetchNetWorthSuccess: (result) => {
    return {
      type: ActionTypes.FETCH_NET_WORTH_SUCCESS,
      result
    }
  },
  fetchNetWorthError: (error) => {
    return {
      type: ActionTypes.FETCH_NET_WORTH_ERROR,
      error
    }
  },
  changeTransactionCategorySuccess: (result) => {
    return {
      type: ActionTypes.CHANGE_TRANSACTION_CATEGORY_SUCCESS,
      result
    }
  },
  changeTransactionCategoryError: (error) => {
    return {
      type: ActionTypes.CHANGE_TRANSACTION_CATEGORY_ERROR,
      error
    }
  },
  fetchBankAssetsSuccess: (result) => {
    return {
      type: ActionTypes.FETCH_BANK_ASSETS_SUCCESS,
      result
    }
  },
  fetchBankAssetsError: (error) => {
    return {
      type: ActionTypes.FETCH_BANK_ASSETS_ERROR,
      error
    }
  },
  fetchAccountsSuccess: (result) => {
    return {
      type: ActionTypes.FETCH_ACCOUNTS_SUCCESS,
      result
    }
  },
  fetchAccountsError: (error) => {
    return {
      type: ActionTypes.FETCH_ACCOUNTS_ERROR,
      error
    }
  },

};

let thunks = {
  changeTransactionCategory: (transaction, category) => {
    return (dispatch) => {
      return FinancesDao.updateTransaction(transaction, category)
        .then((result) => {
          dispatch(actions.changeTransactionCategorySuccess(result));
        })
        .catch((err) => {
          dispatch(actions.changeTransactionCategoryError(err));
        });
    }
  },
  fetchCategories: () => {
    return (dispatch) => {
      return FinancesDao.fetchCategories()
        .then((result) => {
          dispatch(actions.fetchCategoriesSuccess(result));
        })
        .catch((err) => {
          dispatch(actions.fetchCategoriesError(err));
        })
    };
  },
  fetchChartTransactions: (query) => {
    return (dispatch) => {
      return FinancesDao.fetchChartTransactions(query)
        .then((result) => {
          dispatch(actions.fetchChartTransactionsSuccess(result));
        })
        .catch((err) => {
          dispatch(actions.fetchChartTransactionsError(err));
        })
    };
  },
  fetchTransactions: (query) => {
    return (dispatch) => {
      return FinancesDao.fetchTransactions(query)
        .then((result) => {
          dispatch(actions.fetchTransactionsSuccess(result));
        })
        .catch((err) => {
          dispatch(actions.fetchTransactionsError(err));
        })
    };
  },
  fetchNetIncome: (dateRange) => {
    return (dispatch) => {
      return FinancesDao.fetchNetIncome(dateRange)
        .then((result) => {
          dispatch(actions.fetchNetIncomeSuccess(result));
        })
        .catch((err) => {
          dispatch(actions.fetchNetIncomeError(err));
        })
    };
  },
  fetchNetWorth: (dateRange) => {
    return (dispatch) => {
      return FinancesDao.fetchNetWorth(dateRange)
        .then((result) => {
          dispatch(actions.fetchNetWorthSuccess(result));
        })
        .catch((err) => {
          dispatch(actions.fetchNetWorthError(err));
        })
    };
  },
  fetchAccounts: () => {
    return (dispatch) => {
      return FinancesDao.fetchAccounts()
        .then((result) => {
          dispatch(actions.fetchAccountsSuccess(result));
        })
        .catch((err) => {
          dispatch(actions.fetchAccountsError(err));
        })
    };
  },
  fetchBankAssets: (dateRange) => {
    return (dispatch) => {
      let props = {
        bankAssets: FinancesDao.fetchBankAssets(dateRange),
        investmentAssets: FinancesDao.fetchInvestmentAssets(dateRange),
        debts: FinancesDao.fetchDebts(dateRange)
      };

      return Promise.props(props)
        .then((result) => {
          dispatch(actions.fetchBankAssetsSuccess(result));
        })
        .catch((err) => {
          dispatch(actions.fetchBankAssetsError(err));
        })
    };
  }
};

module.exports = _.assign({}, actions, thunks);
