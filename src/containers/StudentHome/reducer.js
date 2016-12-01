import * as types from '../../actionTypes';

const initialState = {
  courses: [{courseName:' ', chapters: [{name:'', owner:'', contributors:'', src_url:'', pdf_url:''}]}],
  showSearch: false,
  showModal: false,
};

function studentReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_COURSES_SUCCESS:
      return Object.assign({}, state, {
        courses: action.courses,
      });
    case types.ADD_COURSE_MODAL:
      return Object.assign({}, state, {
        showModal: !state.showModal
      });
    case types.CLOSE_MODAL:
      return Object.assign({}, state, {
        showModal: false
      });
    default:
      return state;
  }
}

export default studentReducer;
