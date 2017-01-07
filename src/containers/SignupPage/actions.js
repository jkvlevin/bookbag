import * as types from '../../actionTypes';
import { browserHistory } from 'react-router';
import axios from 'axios';
import toastr from 'toastr';

export function createAccountSuccess() {
  return { type: types.CREATE_ACCOUNT_SUCCESS };
}

export function createAccount(firstName, lastName, email, password, isProf) {
  return function (dispatch) {
    if (isProf) {
      axios.post('/api/prof/createaccount', {
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email
      }).then((response) => {
        if(response.status !== 200) {
          toastr.error('Account creation failure');
        } else {
          localStorage.setItem('userToken', response.data.token);
          localStorage.setItem('userName', response.data.name);
          localStorage.setItem('isProfessor', response.data.prof);
          dispatch(createAccountSuccess());
          browserHistory.push('/professor');
        }
      });
    } else {
      axios.post('/api/student/createaccount', {
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email
      }).then((response) => {
        if(response.status !== 200 ) {
          toastr.error('Account creation failure');
        } else {
          localStorage.setItem('userToken', response.data.token);
          localStorage.setItem('userName', response.data.name);
          localStorage.setItem('isProfessor', response.data.prof);
          dispatch(createAccountSuccess());
          browserHistory.push('/student');
        }
      });
    }
  };
}
