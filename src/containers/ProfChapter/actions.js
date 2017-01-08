import * as types from '../../actionTypes';
import axios from 'axios';

export function checkoutChapter(id) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/checkoutchapter',
      headers: { Authorization: authLine },
      data: { chapter: id }
    }).then((response) => {
      dispatch(getChapterById(id));
    });
  }
}

export function submitFiles(files, message, chapter) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  var formdata = new FormData();
  for (var i = 0; i < files.length; i++)
    formdata.append("files", files[i]);
  formdata.append("chapter", chapter);
  formdata.append("commitMessage", message);
  
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/upload',
      headers: { Authorization: authLine, 'Content-Type': 'multipart/form-data' },
      data: formdata
    }).then((response) => {
      console.log("made request");
      dispatch(getChapterById(chapter));
    });
  }
}

export function getChapterById(id) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/getchapterbyid',
      headers: { Authorization: authLine },
      data: { chapter: id }
    }).then((response) => {
      dispatch(loadCurrentChapterSuccess(response.data));
    });
  }
}

export function loadCurrentChapterSuccess(chapter) {
  return { type: types.LOAD_CURRENT_CHAPTER_SUCCESS, chapter };
}

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
      dispatch(loadVersionFilesSuccess(versionFiles));
    });
  }
}

export function loadVersionFilesSuccess(versionFiles) {
  return { type: types.LOAD_VERSION_FILES_SUCCESS, versionFiles };
}

export function changeCurrentVersionFiles(chapterId, sha) {
  const token = localStorage.getItem('userToken');
  var authLine = 'Bearer ' + token;
  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/prof/getchaptercontentsprevious',
      headers: { Authorization: authLine },
      data: { chapterId: chapterId, sha: sha}
    }).then((response) => {
      const versionFiles = response.data;
      console.log(versionFiles);
      dispatch(changeCurrentVersionFilesSuccess(versionFiles));
    });
  }
}

export function changeCurrentVersionFilesSuccess(versionFiles) {
  return { type: types.CHANGE_CURRENT_VERSION_FILES_SUCCESS, versionFiles };
}

export function changeCurrentVersion(version) {
  return { type: types.CHANGE_CURRENT_VERSION_SUCCESS, version };
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
