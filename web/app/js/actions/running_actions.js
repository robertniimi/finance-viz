import ActionTypes from 'action_types';
import FinancesDao from '../dao/finances_dao';
import Promise from 'bluebird';

let actions = {
  authenticateStrava() {
    return {
      type: ActionTypes.AUTHENTICATE_STRAVA,
    }
  },
  fetchTransactionsSuccess(result) {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS_SUCCESS,
      result,
    };
  },
  fetchTransactionsError(error) {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS_ERROR,
      error,
    };
  },
  fetchChartTransactionsSuccess(result) {
    return {
      type: ActionTypes.FETCH_CHART_TRANSACTIONS_SUCCESS,
      result,
    };
  },
  fetchChartTransactionsError(error) {
    return {
      type: ActionTypes.FETCH_CHART_TRANSACTIONS_ERROR,
      error,
    };
  },
  fetchCategoriesSuccess(result) {
    return {
      type: ActionTypes.FETCH_CATEGORIES_SUCCESS,
      result,
    };
  },
  fetchCategoriesError(error) {
    return {
      type: ActionTypes.FETCH_CATEGORIES_ERROR,
      error,
    };
  },
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
  fetchNetIncomeSuccess(result) {
    return {
      type: ActionTypes.FETCH_NET_INCOME_SUCCESS,
      result,
    };
  },
  fetchNetIncomeError(error) {
    return {
      type: ActionTypes.FETCH_NET_INCOME_ERROR,
      error,
    };
  },
  fetchNetWorthSuccess(result) {
    return {
      type: ActionTypes.FETCH_NET_WORTH_SUCCESS,
      result,
    };
  },
  fetchNetWorthError(error) {
    return {
      type: ActionTypes.FETCH_NET_WORTH_ERROR,
      error,
    };
  },
  changeTransactionCategorySuccess(result) {
    return {
      type: ActionTypes.CHANGE_TRANSACTION_CATEGORY_SUCCESS,
      result,
    };
  },
  changeTransactionCategoryError(error) {
    return {
      type: ActionTypes.CHANGE_TRANSACTION_CATEGORY_ERROR,
      error,
    };
  },
  fetchBankAssetsSuccess(result) {
    return {
      type: ActionTypes.FETCH_BANK_ASSETS_SUCCESS,
      result,
    };
  },
  fetchBankAssetsError(error) {
    return {
      type: ActionTypes.FETCH_BANK_ASSETS_ERROR,
      error,
    };
  },
  fetchAccountsSuccess(result) {
    return {
      type: ActionTypes.FETCH_ACCOUNTS_SUCCESS,
      result,
    };
  },
  fetchAccountsError(error) {
    return {
      type: ActionTypes.FETCH_ACCOUNTS_ERROR,
      error,
    };
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
    };
  },
};

module.exports = _.assign({}, actions, thunks);
