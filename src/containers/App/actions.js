import * as types from '../../actionTypes';

export function setUser(user) {
  return { type: types.SET_USER, user};
}
