import * as types from '../../actionTypes';
import { setUser } from '../App/actions.js';
import { browserHistory } from 'react-router';
import axios from 'axios';

export function login(email, password) {
  return (dispatch) => {
    // axios.post('bookbagapp/heroku.com/userlogin', {
    //   email: email,
    //   password: password
    // })
    // .then(res => {
    //   user = res.data;
    const user = {
      email: email,
      password: password
    };
    dispatch(loginSuccess());
    setUser(user);
    browserHistory.push("/student");
    // });
  };
}

export function loginSuccess() {
  return { type: types.LOGIN_SUCCESS };
}
