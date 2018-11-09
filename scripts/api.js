/* eslint-env jquery */
'use strict';

// eslint-disable-next-line no-unused-vars
const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/sean';

  function getBookmarks(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  }

  function createBookmark() {}

  function updateBookmark() {}

  function deleteBookmark() {}

  return {getBookmarks, createBookmark, updateBookmark, deleteBookmark};
}());