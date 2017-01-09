import * as types from '../../actionTypes';
import axios from 'axios';

export function publishCourse(id) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/makecoursepublic',
      headers: { Authorization : authLine},
      data: { course: id }
    }).then((response) => {
      dispatch(getCourseById(id));
    });
  };
}

export function changeSettings(name, description, keywords, id) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/changecourseinfo',
      headers: { Authorization : authLine},
      data: { name: name, description: description, keywords:keywords, course: id }
    }).then((response) => {
      dispatch(getCourseById(id));
    });
  };
}

export function addChapterToCourse(chapter, course) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/addchaptertocourse',
      headers: { Authorization : authLine},
      data: { chapter: chapter, course: course }
    }).then((response) => {
      dispatch(getCourseById(course));
    });
  };
}

export function getCourseById(id) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/getcoursebyid',
      headers: { Authorization : authLine},
      data: { course: id }
    }).then((response) => {
        const course = response.data;
        dispatch(loadCourseByIdSuccess(course));
    });
  };
}

export function loadCourseByIdSuccess(course) {
  return { type: types.LOAD_COURSE_BY_ID_SUCCESS, course };
}

export function deleteChapter(chapter, course) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/removechapterfromcourse',
      headers: { Authorization : authLine},
      data: { chapter: chapter, course: course }
    }).then((response) => {
    });
  };
}

export function changeAddChapterTab(tab) {
  return { type: types.CHANGE_ADD_CHAPTER_TAB, tab };
}

export function searchChapters(searchValue) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/searchchapters',
      headers: { Authorization : authLine},
      data: { searchQuery: searchValue }
    }).then((response) => {
        dispatch(searchChaptersSuccess(response.data));
    });
  };
}

export function searchChaptersSuccess(chapters) {
  return { type: types.SEARCH_CHAPTERS_SUCCESS, chapters };
}

export function searchModal() {
  return { type: types.SEARCH_MODAL };
}

export function closeSearchModal() {
  return { type: types.CLOSE_SEARCH_MODAL };
}
