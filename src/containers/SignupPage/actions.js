import * as types from '../../actionTypes';
import { browserHistory } from 'react-router';
import { setUser } from '../App/actions.js';
import axios from 'axios';
import toastr from 'toastr';

export function createAccountSuccess() {
  return { type: types.CREATE_ACCOUNT_SUCCESS };
}

export function createAccount(name, email, password) {
  return function (dispatch) {
    axios.post('/api/createstudentaccount', {
      name: name,
      pw: password,
      email: email
    }).then((response) => {
      if(response.data !== 'success') {
        toastr.error('Login failure');
      } else {
        dispatch(createAccountSuccess());
        dispatch(setUser(email));
        browserHistory.push('/student');
      }
    });
  };
}
