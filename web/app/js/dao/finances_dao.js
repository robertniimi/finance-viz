import request from 'ajax_utils';
import querystring from 'querystring';

module.exports = {
  // queryObj
  fetchTransactions: (queryObj, successAction, failureAction) => {
    let query = querystring.stringify(queryObj);
    console.log('[finances_dao] @fetchTransactions -> query: ', query);

    return request.get(`/mint/transactions?${ query }`);
      // .then((transactions) => {
      //   console.log('[finances_dao] @fetchTransactions -> transactions: ', transactions);
      //   let { data } = _.find(transactions.set, (setObj) => {
      //     return setObj.id === 'transactions';
      //   });
      //   successAction(data);
      // })
      // .catch((err) => {
      //   failureAction(err);
      // })
  },
  // queryObj
  fetchChartTransactions: (queryObj, successAction, failureAction) => {
    let query = querystring.stringify(queryObj);
    console.log('[finances_dao] @fetchChartTransactions -> query: ', query);

    return request.get(`/mint/chart/transactions?${ query }`);
      // .then((transactions) => {
      //   successAction(transactions);
      // })
      // .catch((err) => {
      //   failureAction(err);
      // })
  },

};
