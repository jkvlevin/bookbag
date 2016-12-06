import * as types from '../../actionTypes';

const initialState = {
  courses: [{courseName:' ', chapters: [{id:'', name:'', owner:'', contributors:'', src_url:'', pdf_url:''}]}],
  showSearchModal: false,
  showFolderModal: false,
  searchContent: [''],
  folders: [{folderName:' ', chapters: [{id: '', name:'', owner:'', contributors:'', src_url:'', pdf_url:''}]}]
};

function studentReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_COURSES_SUCCESS:
      return Object.assign({}, state, {
        courses: action.courses,
      });
    case types.LOAD_FOLDERS_SUCCESS:
      return Object.assign({}, state, {
        folders: action.folders,
      });
    case types.SEARCH_MODAL:
      return Object.assign({}, state, {
        showSearchModal: !state.showSearchModal
      });
    case types.FOLDER_MODAL:
      return Object.assign({}, state, {
        showFolderModal: !state.showFolderModal
      });
    case types.CLOSE_SEARCH_MODAL:
      return Object.assign({}, state, {
        showSearchModal: false,
        searchContent: ['']
      });
    case types.CLOSE_FOLDER_MODAL:
      return Object.assign({}, state, {
        showFolderModal: false,
      });
    case types.SEARCH_RESPONSE_SUCCESS:
      return Object.assign({}, state, {
        searchContent: action.searchResponse
      });
    default:
      return state;
  }
}

export default studentReducer;
