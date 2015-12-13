import ActionTypes from 'action_types';

module.exports = {
  fetchTransactions: (query) => {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS,
      query
    };
  },
  fetchTransactionsSuccess: (transactions) => {
    return {
      type: ActionTypes.FETCH_TRANSACTIONS_SUCCESS,
      transactions
    }
  },
  changeDateRange: (dateRange) => {
    return {
      type: ActionTypes.CHANGE_DATE_RANGE,
      dateRange
    }
  }
};
