import ActionTypes from 'action_types';

module.exports = {
  fetchTransactions: (query, successAction, failureAction) => {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS,
      success: successAction,
      failure: failureAction,
      query
    };
  },
  fetchTransactionsSuccess: (transactions) => {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS_SUCCESS,
      transactions
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
  fetchCategoriesSuccess: (categories) => {
    return {
      type: ActionTypes.FETCH_CATEGORIES_SUCCESS,
      categories
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
  }
};
