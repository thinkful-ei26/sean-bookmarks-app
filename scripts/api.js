/* eslint-env jquery */
'use strict';

// eslint-disable-next-line no-unused-vars
const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/sean';

  function getBookmarks(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  }

  function createBookmark(data, callbackSuccess, callbackError) {
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: callbackSuccess,
      error: callbackError
    });
  }

  function updateBookmark() {}

  function deleteBookmark(id, callbackSuccess, callbackError) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      success: callbackSuccess,
      error: callbackError
    });
  }

  return {getBookmarks, createBookmark, updateBookmark, deleteBookmark};
}());