import * as types from '../../actionTypes';

const initialState = {
  currentDisplay: 'courses',
  courses: [],
  chapters: [],
  showSearch: false,
};

function studentReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_COURSES_SUCCESS:
      return Object.assign({}, state, {
        courses: action.courses
      });
    default:
      return state;
  }
}

export default studentReducer;
