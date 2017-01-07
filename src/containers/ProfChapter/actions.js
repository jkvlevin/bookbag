import * as types from '../../actionTypes';
import axios from 'axios';


export function loadChapterVersions(id){
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/getchapterhistory',
      headers: { Authorization: authLine },
      data: { chapterId: id }
    }).then((response) => {
      const chapterVersions = response.data;
      dispatch(loadChapterVersionsSuccess(chapterVersions));
    });
  }
}

export function loadChapterVersionsSuccess(chapterVersions) {
  return { type: types.LOAD_CHAPTER_VERSIONS_SUCCESS, chapterVersions };
}

export function loadVersionFiles(chapterId, sha) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/getchaptercontents',
      headers: { Authorization: authLine },
      data: { chapterId: chapterId}
    }).then((response) => {
      const versionFiles = response.data;
      console.log(versionFiles);
      dispatch(loadVersionFilesSuccess(versionFiles));
    });
  }
}

export function loadVersionFilesSuccess(versionFiles) {
  return { type: types.LOAD_VERSION_FILES_SUCCESS, versionFiles };
}

export function changeCurrentVersion(version) {
  return { type: types.CHANGE_CURRENT_VERSION, version };
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
