import * as types from '../../actionTypes';
import toastr from 'toastr';
import axios from 'axios';

export function addToFolder(folder, chapter) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/student/addchaptertofolder',
      headers: { Authorization : authLine},
      data: { folder: folder, chapter: chapter }
    }).then((response) => {
      if(response.status === 200) {
        dispatch(loadFolders());
        toastr.success(response.data.chaptername + ' added to ' + response.data.foldername);
      } else if (response.status === 202) {
        toastr.warning(response.data.chaptername + ' already in folder ' + response.data.foldername);
      }
    });
  };
}

export function subscribeToCourse(id) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/student/addcourse',
      headers: { Authorization : authLine},
      data: { course: id }
    }).then((response) => {
      if(response.status === 200) {
        dispatch(loadCourses());
        toastr.success('You are now subscribed to ' + response.data.coursename);
      } else if (response.status === 202) {
        toastr.warning('You are already subscribed to'  + response.data.coursename);
      }
    });
  };
}

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
        const chapters = response.data[0];
        const courses = response.data[1];
        dispatch(searchResponseChapters(chapters));
        dispatch(searchResponseCourses(courses));
    });
  };
}

export function searchResponseChapters(chapters) {
  return { type: types.SEARCH_RESPONSE_CHAPTERS, chapters };
}

export function searchResponseCourses(courses) {
  return { type: types.SEARCH_RESPONSE_COURSES, courses };
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
