import * as types from '../../actionTypes';

const initialState = {
  showSearchModal: false,
  activeAddChapterTab: 1,
  hasSearched: false,
  searchChaptersResult: [],
  searchContent: [],
  currentCourse: { courseInfo:{}, chapters: [{}]}
};

function courseReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_COURSE_BY_ID_SUCCESS:
      return Object.assign({}, state, {
        currentCourse: action.course
      });
    case types.CHANGE_ADD_CHAPTER_TAB:
      return Object.assign({}, state, {
        activeAddChapterTab: action.tab
      });
    case types.SEARCH_CHAPTERS_SUCCESS:
      return Object.assign({}, state, {
        searchChaptersResult: action.chapters,
        hasSearched: true
      })
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

export default courseReducer;
