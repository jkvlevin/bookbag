import * as types from '../../actionTypes';

const initialState = {
  currentChapter: { id:'U_Uws2an', name:'' },
  chapterVersions: [{ version: 1, sha:'', message: '', author:'', date:'' }],
  versionDisplayed: { version: 1, sha:'', message: '', author:'', date:'' },
  currentVersionFiles: [{ filename: '', downloadURL: '', isPDF:true }],
  showSearchModal: false,
  searchContent: [],
};

function chapterReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_CHAPTER_VERSIONS_SUCCESS:
      return Object.assign({}, state, {
        chapterVersions: action.chapterVersions,
        versionDisplayed: action.chapterVersions[0]
      });
    case types.LOAD_VERSION_FILES_SUCCESS:
      return Object.assign({}, state, {
        currentVersionFiles: action.versionFiles
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

export default chapterReducer;
