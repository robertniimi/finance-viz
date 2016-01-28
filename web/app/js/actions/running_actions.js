import ActionTypes from 'action_types';
import FinancesDao from '../dao/finances_dao';
import Promise from 'bluebird';

let actions = {
  authenticateStrava() {
    return {
      type: ActionTypes.AUTHENTICATE_STRAVA,
    }
  },
};

let thunks = {
  // changeTransactionCategory: (transaction, category) => {
  //   return (dispatch) => {
  //     return FinancesDao.updateTransaction(transaction, category)
  //       .then((result) => {
  //         dispatch(actions.changeTransactionCategorySuccess(result));
  //       })
  //       .catch((err) => {
  //         dispatch(actions.changeTransactionCategoryError(err));
  //       });
  //   };
  // },
};

module.exports = _.assign({}, actions, thunks);
