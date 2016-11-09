import * as types from '../../actionTypes';

const initialState = {
  currentDisplay: 'courses',
  courses: [],
  chapters: [],
  courseNames: [],
  showSearch: false,
  showModal: false
};

function studentReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_COURSES_SUCCESS:
      return Object.assign({}, state, {
        courses: action.courses
      });
    case types.ADD_COURSE_MODAL:
      return Object.assign({}, state, {
        showModal: !state.showModal
      });
    case types.CLOSE_MODAL:
      return Object.assign({}, state, {
        showModal: false
      });
    case types.LOAD_COURSE_NAMES_SUCCESS:
      return Object.assign({}, state, {
        courseNames: action.courseNames
      });
    default:
      return state;
  }
}

export default studentReducer;
