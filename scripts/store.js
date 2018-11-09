'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function() {
  function addBookmark(bookmark) {
    this.bookmarks.push(bookmark);
  }

  return {
    bookmarks: [],
    minimumRating: 0,
    create: false,

    addBookmark
  };
}());