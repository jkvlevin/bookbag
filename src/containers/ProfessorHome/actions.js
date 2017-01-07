import * as types from '../../actionTypes';
import axios from 'axios';

export function submitNewChapter(name, description, keywords, checkoutTime) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/createchapter',
      headers: { Authorization : authLine},
      data: { chapterName: name, checkout_dur: checkoutTime, keywords: keywords, description: description, contributors: [] }
    }).then((response) => {
        console.log('sent');
    });
  };
}

export function switchTabs(tab) {
  return { type: types.SWITCH_TABS, tab };
}

export function search(searchValue) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/search',
      headers: { Authorization : authLine},
      data: { searchQuery: searchValue }
    }).then((response) => {
        const searchResponse = [];
        for (let chapter in response.data) {
          searchResponse.push(response.data[chapter].name);
        }
        dispatch(searchResponseSuccess(searchResponse));
    });
  };
}

export function searchResponseSuccess(searchResponse) {
  return { type: types.SEARCH_RESPONSE_SUCCESS, searchResponse };
}

export function searchModal() {
  return { type: types.SEARCH_MODAL };
}

export function closeSearchModal() {
  return { type: types.CLOSE_SEARCH_MODAL };
}
