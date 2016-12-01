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

export function addCourse(email, courseName) {
  console.log(email + '' + courseName);
  return function (dispatch) {
    axios.post('/api/addCourse', {
      email: email,
      courseName: courseName
    }).then((response) => {
      setTimeout(function(){ dispatch(loadCourses(email)); }, 3000);
    });
  };
}

export function addCourseModal() {
  return { type: types.ADD_COURSE_MODAL };
}

export function closeModal() {
  return { type: types.CLOSE_MODAL };
}
