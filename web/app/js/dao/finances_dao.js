import request from 'ajax_utils';
import querystring from 'querystring';

module.exports = {
  // queryObj
  fetchTransactions: (queryObj) => {
    let query = querystring.stringify(queryObj);
    return request.get(`/mint/transactions?${ query }`);
  },
  // queryObj
  fetchChartTransactions: (queryObj) => {
    let query = querystring.stringify(queryObj);
    return request.get(`/mint/chart/transactions?${ query }`);
  },

  fetchCategories: () => {
    return request.get(`/mint/categories`);
  },

  // query = (string)
  getAutosuggestFilters: (strQuery) => {
    let query = { query: strQuery };
    return request.get(`/mint/autosuggestFilter?${ querystring.stringify(query) }`);
  },

  updateTransaction: (transaction, category) => {
    console.log('[finances_dao] @updateTransaction');
    return request.post(`/mint/transactions`, { transaction, category });
  }
};
