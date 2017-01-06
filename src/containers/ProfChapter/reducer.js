import * as types from '../../actionTypes';

const initialState = {
  showSearchModal: false,
  searchContent: [],
};

function chapterReducer(state = initialState, action) {
  switch (action.type) {
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

export default chapterReducer;
