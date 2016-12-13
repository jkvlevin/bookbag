import * as types from '../../actionTypes';
import axios from 'axios';

export function loadCourses() {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/student/getcourses',
      headers: { Authorization : authLine}
    }).then((response) => {
        const courses = response.data;
        dispatch(loadCoursesSuccess(courses));
    });
  };
}

export function loadCoursesSuccess(courses) {
  return { type: types.LOAD_COURSES_SUCCESS, courses };
}

export function search(searchValue) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/search',
      headers: { Authorization : authLine},
      data: { searchQuery: searchValue }
    }).then((response) => {
        const searchResponse = [];
        for (let chapter in response.data) {
          searchResponse.push(response.data[chapter].name);
        }
        dispatch(searchResponseSuccess(searchResponse));
    });
  };
}

export function searchResponseSuccess(searchResponse) {
  return { type: types.SEARCH_RESPONSE_SUCCESS, searchResponse };
}


export function addFolder(folderName) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/addfolder',
      headers: { Authorization : authLine},
      data: { folderName: folderName }
    }).then((response) => {
        const folders = response.data;
        dispatch(loadFoldersSuccess(folders));
    });
  };
}

export function loadFolders() {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/getfolders',
      headers: { Authorization : authLine},
    }).then((response) => {
      const folders = response.data;
      dispatch(loadFoldersSuccess(folders));
    });
  };
}

export function loadFoldersSuccess(folders) {
  return { type: types.LOAD_FOLDERS_SUCCESS, folders };
}

export function selectCourse(course) {
  return { type: types.SELECT_COURSE, course };
}

export function selectFolder(folder) {
  return { type: types.SELECT_FOLDER, folder };
}

export function searchModal() {
  return { type: types.SEARCH_MODAL };
}

export function folderModal() {
  return { type: types.FOLDER_MODAL };
}

export function closeSearchModal() {
  return { type: types.CLOSE_SEARCH_MODAL };
}

export function closeFolderModal() {
  return { type: types.CLOSE_FOLDER_MODAL };
}
