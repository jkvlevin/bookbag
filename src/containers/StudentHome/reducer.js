import * as types from '../../actionTypes';

const initialState = {
  courses: [{courseName:' ', description:'', chapters: [{id:'', name:'', ownername:'', contributors:'', src_url:'', pdf_url:''}]}],
  showSearchModal: false,
  showFolderModal: false,
  searchContentCourses: [],
  searchContentChapters: [],
  folders: [{folderName:' ', chapters: [{id: '', name:'', owner:'', contributors:'', src_url:'', pdf_url:''}]}],
  selectedCourse: {courseName:' ', description:'', chapters: [{id:'', name:'', ownername:'', contributors:'', src_url:'', pdf_url:''}]},
  selectedFolder: {folderName:' ', chapters: [{id: '', name:'', owner:'', contributors:'', src_url:'', pdf_url:''}]},
  isCourseSelected: true,
};

function studentReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_COURSES_SUCCESS:
      if (action.courses.length > 0 ) {
        return Object.assign({}, state, {
          courses: action.courses,
          selectedCourse: action.courses[0]
        });
      } else {
        return Object.assign({}, state, {
          courses: action.courses,
        });
      }
    case types.LOAD_FOLDERS_SUCCESS:
      return Object.assign({}, state, {
        folders: action.folders,
      });
    case types.SELECT_COURSE:
      return Object.assign({}, state, {
        selectedCourse: action.course,
        isCourseSelected: true,
      });
    case types.SELECT_FOLDER:
      return Object.assign({}, state, {
        selectedFolder: action.folder,
        isCourseSelected: false
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
        searchContent: []
      });
    case types.CLOSE_FOLDER_MODAL:
      return Object.assign({}, state, {
        showFolderModal: false,
      });
    case types.SEARCH_RESPONSE_CHAPTERS:
      return Object.assign({}, state, {
        searchContentChapters: action.chapters
      });
    case types.SEARCH_RESPONSE_COURSES:
      return Object.assign({}, state, {
        searchContentCourses: action.courses
      });
    default:
      return state;
  }
}

export default studentReducer;
