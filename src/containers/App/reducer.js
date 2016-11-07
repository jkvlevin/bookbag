import * as types from '../../actionTypes';

const initialState = {
  currentUser: {}
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
      return Object.assign({}, state, {
        currentUser: action.user
      });
    default:
      return state;
  }
}

export default appReducer;
