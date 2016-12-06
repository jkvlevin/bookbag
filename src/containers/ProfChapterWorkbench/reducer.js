import * as types from '../../actionTypes';

const initialState = {
  activeTab: 1
};

function profChapterWorkbenchReducer(state = initialState, action) {
  switch (action.type) {
    case types.SWITCH_CHAPTER_TABS:
      return Object.assign({}, state, {
        activeTab: action.tab,
      });
    default:
      return state;
  }
}

export default profChapterWorkbenchReducer;
