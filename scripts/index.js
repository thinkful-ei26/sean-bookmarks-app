/* global api, store, bookmarkList */
/* eslint-env jquery */
'use strict';

$(document).ready(function() {
  // get all from api, add to store and render
  api.getBookmarks(bookmarks => {
    bookmarks.forEach(bookmark => store.addBookmark(bookmark));
    bookmarkList.render();
  });

  // bind event listeners and render
  bookmarkList.bindEventListeners();
  bookmarkList.render();
});