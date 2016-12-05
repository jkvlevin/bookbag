import * as types from '../../actionTypes';

const initialState = {
  activeTab: 1
};

function professorReducer(state = initialState, action) {
  switch (action.type) {
    case types.SWITCH_TABS:
      return Object.assign({}, state, {
        activeTab: action.tab,
      });
    default:
      return state;
  }
}

export default professorReducer;
