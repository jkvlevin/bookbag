import * as types from '../../actionTypes';
import axios from 'axios';

export function loadCourses(email) {
  return function (dispatch) {
    axios.post('/api/getcourses', {
      email: email
    }).then((response) => {
        const courses = response.data;
        dispatch(loadCourseChapters(email, courses));
    });
  };
}

export function loadCourseChapters(email, courses) {
  console.log(courses);
  return function (dispatch) {
    axios.post('/api/getcoursechapters', {
      email: email,
      courses: courses
    }).then((response) => {
        const coursesWithChapters = response.data;
        console.log(coursesWithChapters);
        dispatch(loadCoursesSuccess(coursesWithChapters));
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
