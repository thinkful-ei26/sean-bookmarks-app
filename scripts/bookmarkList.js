/* global store */
/* eslint-env jquery */
'use strict';

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function() {
  function genterateBookmarkElement(bookmark) {
    return `
      <li data-bookmark-id="${bookmark.id}">
        <div class="bookmark-header">
          <h2 class="bookmark-title">${bookmark.title}</h2>
          <ul>
            <li><button class="bookmark-edit"><span class="button-label">Edit</span></button></li>
            <li><button class="bookmark-remove"><span class="button-label">Remove</span></button></li>
          </ul>
        </div>
        <div class="bookmark">
          <p class="bookmark-rating">${bookmark.rating} / 5</p>
        </div>
      </li>
    `;
  }
  
  function generateBookmarksString(bookmarksList) {
    const bookmarks = bookmarksList.map(bookmark => genterateBookmarkElement(bookmark));
    return bookmarks.join('');
  }
  
  function render() {
    let bookmarks = [...store.bookmarks];

    const bookmarksString = generateBookmarksString(bookmarks);
    $('.bookmark-list').html(bookmarksString);
  }
  
  function bindEventListeners() {}

  return {
    render,
    bindEventListeners
  };
}());