import * as types from '../../actionTypes';

const initialState = {
  isValid: true,
  isLoading: false
};

export default function signupReducer(state = initialState, action) {
  switch(action.type) {
    case types.CREATE_ACCOUNT:
      return Object.assign({}, state, {
        isLoading: true
      });
    case types.CREATE_ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false
    });
    default:
      return state;
  }
}
