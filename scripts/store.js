'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function() {
  function addBookmark(bookmark) {
    this.bookmarks.push(bookmark);
  }

  function findById(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  }

  function findAndDelete(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  }

  function toggleBookmarkIsExpanded(id) {
    const bookmark = this.findById(id);
    bookmark.isExpanded = !bookmark.isExpanded;
  }

  function setCreate(val) {
    this.create = val;
  }

  function setMinimumRating(val) {
    this.minimumRating = val;
  }

  return {
    bookmarks: [],
    minimumRating: 0,
    create: false,

    addBookmark,
    findById,
    findAndDelete,
    toggleBookmarkIsExpanded,
    setCreate,
    setMinimumRating
  };
}());