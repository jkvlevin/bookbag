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

export function searchModal() {
  return { type: types.SEARCH_MODAL };
}

export function closeModal() {
  return { type: types.CLOSE_MODAL };
}
