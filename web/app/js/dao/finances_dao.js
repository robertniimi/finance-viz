import request from 'ajax_utils';
import querystring from 'querystring';

// Arg Defs
// ========
// dateRange = {
//   label: (string)
//   value: (string)
//   start: (string)
//   end: (string)
// }


module.exports = {
  // queryObj
  fetchTransactions: (queryObj) => {
    let query = querystring.stringify(queryObj);
    return request.get(`/mint/transactions?${ query }`);
  },
  // queryObj
  fetchChartTransactions: (dateRange) => {
    let query = {
      start: dateRange.start,
      end: dateRange.end
    };

    return request.get(`/mint/chart/transactions?${ querystring.stringify(query) }`);
  },

  fetchCategories: () => {
    return request.get(`/mint/categories`);
  },

  fetchNetIncome: (dateRange) => {
    let query = dateRange;
    return request.get(`/mint/chart/netIncome?${ querystring.stringify(query) }`);
  },

  fetchNetWorth: (dateRange) => {
    let query = dateRange;
    return request.get(`/mint/chart/netWorth?${ querystring.stringify(query) }`);
  },

  fetchBankAssets: (dateRange) => {
    let query = dateRange;
    return request.get(`/mint/chart/bankAssets?${ querystring.stringify(query) }`);
  },

  fetchInvestmentAssets: (dateRange) => {
    let query = dateRange;
    return request.get(`/mint/chart/investmentAssets?${ querystring.stringify(query) }`);
  },

  fetchAccounts: () => {
    return request.get('/mint/accounts');
  },

  getAutosuggestFilters: (strQuery) => {
    let query = { query: strQuery };
    return request.get(`/mint/autosuggestFilter?${ querystring.stringify(query) }`);
  },

  updateTransaction: (transaction, category) => {
    console.log('[finances_dao] @updateTransaction');
    return request.post(`/mint/transactions`, { transaction, category });
  }
};
