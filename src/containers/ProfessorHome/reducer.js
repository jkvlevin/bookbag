import * as types from '../../actionTypes';

const initialState = {
  activeTab: 1,
  showSearchModal: false,
  searchContent: []
};

function professorReducer(state = initialState, action) {
  switch (action.type) {
    case types.SWITCH_TABS:
      return Object.assign({}, state, {
        activeTab: action.tab,
      });
    case types.SEARCH_MODAL:
      return Object.assign({}, state, {
        showSearchModal: !state.showSearchModal
      });
    case types.CLOSE_SEARCH_MODAL:
      return Object.assign({}, state, {
        showSearchModal: false,
        searchContent: []
      });
    case types.SEARCH_RESPONSE_SUCCESS:
      return Object.assign({}, state, {
        searchContent: action.searchResponse
      });
    default:
      return state;
  }
}

export default professorReducer;
