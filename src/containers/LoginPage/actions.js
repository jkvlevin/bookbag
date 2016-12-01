import * as types from '../../actionTypes';
import { setUser } from '../App/actions.js';
import { browserHistory } from 'react-router';
import axios from 'axios';
import toastr from 'toastr';

export function login(email, password) {
  return function (dispatch) {
    axios.post('/api/login', {
      email: email,
      password: password
    }).then((response) => {
      if(response.status !== 200) {
        toastr.error('Login failure, invalid username or password');
      } else {
        dispatch(setUser(email));
        localStorage.setItem('userToken', response.data.token);
        dispatch(loginSuccess());
        browserHistory.push("/student");
      }
    });
  };
}

export function loginSuccess() {
  return { type: types.LOGIN_SUCCESS };
}
