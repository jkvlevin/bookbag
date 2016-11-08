import * as types from '../../actionTypes';

const initialState = {
  currentDisplay: 'courses',
  courses: [],
  chapters: [],
  showSearch: false,
};

export default function studentHomeReducer(state = initialState, action) {
    case types.LOAD_COURSES_SUCCESS:
      return Object.assign({}, state, {
        courses: action.courses;
      });

    default:
      return state;
  }
}
