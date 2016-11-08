import * as types from '../../actionTypes';

export function setUser(email) {
  return { type: types.SET_USER, email};
}
