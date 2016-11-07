import * as types from '../../actionTypes';
import { browserHistory } from 'react-router';
import axios from 'axios';

export function createAccountSuccess() {
  return { type: types.CREATE_ACCOUNT_SUCCESS };
}

export function createAccount(name, email, password) {
    axios.post('/api/signup', {
        name: name,
        pw: password,
        email: email
      }).then((response) => {
        alert(response.data);
      });
      browserHistory.push('/student');
}
