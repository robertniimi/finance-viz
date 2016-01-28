import ActionTypes from 'action_types';

const initialState = {
  testProp: 'test',
};

function runningReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.AUTHENTICATE_STRAVA:
      return state;
    default:
      return state;
  }
};


module.exports = runningReducer;
