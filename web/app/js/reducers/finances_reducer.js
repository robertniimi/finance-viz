import ActionTypes from 'action_types';

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
