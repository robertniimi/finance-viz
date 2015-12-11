import ActionTypes from 'action_types';
console.log('[finances_actions] ActionTypes: ', ActionTypes);

module.exports = {
  getTransactions: function(queryObj) {
    return {
      type: ActionTypes.GET_TRANSACTIONS,
      payload: queryObj
    };
  }
};
