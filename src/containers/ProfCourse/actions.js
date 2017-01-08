import * as types from '../../actionTypes';
import axios from 'axios';

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

export function searchModal() {
  return { type: types.SEARCH_MODAL };
}

export function closeSearchModal() {
  return { type: types.CLOSE_SEARCH_MODAL };
}
