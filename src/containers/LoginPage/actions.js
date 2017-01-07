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
      if (response.status !== 200) {
        toastr.error('Login failure, invalid username or password');
      } else {
        console.log(response.data);
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('isProfessor', response.data.prof);
        dispatch(setUser(name));
        dispatch(loginSuccess());
        if (localStorage.getItem('isProfessor') === 'true') {
          browserHistory.push("/professor");
        } else browserHistory.push("/student");
      }
    });
  };
}

export function loginSuccess() {
  return { type: types.LOGIN_SUCCESS };
}
