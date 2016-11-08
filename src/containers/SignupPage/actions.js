import * as types from '../../actionTypes';
import { browserHistory } from 'react-router';
import axios from 'axios';
import toastr from 'toastr';

export function createAccountSuccess() {
  browserHistory.push('/student');
  return { type: types.CREATE_ACCOUNT_SUCCESS };
}

export function createAccount(name, email, password) {
  return function (dispatch) {
    axios.post('/api/signup', {
      name: name,
      pw: password,
      email: email
    }).then((response) => {
      if(response.data !== 'success') {
        toastr.error('Login failure');
      }
    });

    dispatch(createAccountSuccess());
  };
}
