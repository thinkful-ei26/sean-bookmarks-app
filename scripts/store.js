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

  function findAndUpdate(id, newData) {
    const bookmark = this.findById(id);
    Object.assign(bookmark, newData);
  }

  function toggleBookmarkIsExpanded(id) {
    const bookmark = this.findById(id);
    if (!bookmark.isEditing) bookmark.isExpanded = !bookmark.isExpanded; // do not expand when editing
  }

  function toggleBookmarkIsEditing(id) {
    const bookmark = this.findById(id);
    bookmark.isEditing = !bookmark.isEditing;
    if (bookmark.isExpanded && bookmark.isEditing) bookmark.isExpanded = false; // easier to render only one state of bookmark
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
    findAndUpdate,
    toggleBookmarkIsExpanded,
    toggleBookmarkIsEditing,
    setCreate,
    setMinimumRating
  };
}());