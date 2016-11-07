import * as types from '../../actionTypes';

const initialState = {
  hasUser: false,
  isLoading: false
};

export default function loginReducer(state = initialState, action) {
  switch(action.type) {
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        hasUser: true,
        isLoading: false
      });
    default:
      return state;
  }
}
