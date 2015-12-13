import ActionTypes from 'action_types';

console.log('[finances_reducer] hello');

const initialState = [{
  payload: {}
}];

function personalApp(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.GET_TRANSACTIONS:
    return [{
      payload: action.payload
    }, ...state];

  default:
    return state;
  }
}

module.exports = personalApp;
