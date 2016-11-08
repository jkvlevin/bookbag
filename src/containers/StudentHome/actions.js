import * as types from '../../actionTypes';
import axios from 'axios';

export function loadCourses(email) {
  return function (dispatch) {
    axios.post('/api/getcourses', {
      email: email
    }).then((response) => {
        const courses = response.data;
        dispatch(loadCoursesSuccess(courses));
    });
  };
}

export function loadCoursesSuccess(courses) {
  return { type: types.LOAD_COURSES_SUCCESS, courses };
}
