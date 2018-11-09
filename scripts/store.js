'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function() {
  function addBookmark(bookmark) {
    this.bookmarks.push(bookmark);
  }

  function findById(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  }

  function toggleBookmarkIsExpanded(id) {
    const bookmark = this.findById(id);
    bookmark.isExpanded = !bookmark.isExpanded;
  }

  return {
    bookmarks: [],
    minimumRating: 0,
    create: false,

    addBookmark,
    findById,
    toggleBookmarkIsExpanded
  };
}());