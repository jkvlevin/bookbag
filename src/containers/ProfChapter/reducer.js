import * as types from '../../actionTypes';

const initialState = {
  chapterVersions: [{ version: 1, sha:'', message: '', author:'', date:'' }],
  versionDisplayed: { version: 1, sha:'', message: '', author:'', date:'' },
  currentVersionFiles: [{ filename: '', downloadURL: '', isPDF:true }],
  showSearchModal: false,
  searchContent: [],
  currentChapter: {},
  checkoutUser: false,
  isOwner: false,
  contributors: [],
  searchProfsResults: []
};

function chapterReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_SEARCH_PROFS_RESULTS:
      return Object.assign({}, state, {
        searchProfsResults: action.profs
      });
    case types.SET_CONTRIBUTORS:
      return Object.assign({}, state, {
        contributors: action.contributors
      });
    case types.SET_IS_CHECKOUT_USER:
      return Object.assign({}, state, {
        checkoutUser: action.isCheckoutUser
      });
    case types.SET_IS_OWNER:
      return Object.assign({}, state, {
        isOwner: action.isOwner
      });
    case types.LOAD_CURRENT_CHAPTER_SUCCESS:
      return Object.assign({}, state, {
        currentChapter: action.chapter
      });
    case types.LOAD_CHAPTER_VERSIONS_SUCCESS:
      return Object.assign({}, state, {
        chapterVersions: action.chapterVersions,
        versionDisplayed: action.chapterVersions[0]
      });
    case types.LOAD_VERSION_FILES_SUCCESS:
      return Object.assign({}, state, {
        currentVersionFiles: action.versionFiles
      });
    case types.CHANGE_CURRENT_VERSION_SUCCESS:
      return Object.assign({}, state, {
        versionDisplayed: action.version,
      })
      case types.CHANGE_CURRENT_VERSION_FILES_SUCCESS:
        return Object.assign({}, state, {
          currentVersionFiles: action.versionFiles,
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

export default chapterReducer;
