import ActionTypes from 'action_types';
import FinancesDao from '../dao/finances_dao';
import Promise from 'bluebird';

let actions = {
  fetchTransactions: (query, successAction, failureAction) => {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS,
      success: successAction,
      failure: failureAction,
      query
    };
  },
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
  fetchChartTransactions: (query, successAction, failureAction) => {
    return {
      type: ActionTypes.FETCH_CHART_TRANSACTIONS,
      success: successAction,
      failure: failureAction,
      query
    };
  },
  fetchChartTransactionsSuccess: (transactions) => {
    return {
      type: ActionTypes.FETCH_CHART_TRANSACTIONS_SUCCESS,
      transactions
    };
  },
  fetchChartTransactionsError: (error) => {
    return {
      type: ActionTypes.FETCH_CHART_TRANSACTIONS_ERROR,
      error
    };
  },
  fetchCategories: (successAction, failureAction) => {
    return {
      type: ActionTypes.FETCH_CATEGORIES,
      success: successAction,
      failure: failureAction
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
  }
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
  }
};

module.exports = _.assign({}, actions, thunks);
