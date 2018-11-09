/* global store */
/* eslint-env jquery */
'use strict';

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function() {
  function genterateBookmarkElement(bookmark) {
    const expanded = bookmark.isExpanded ? `
    <p class="bookmark-description">${bookmark.desc}<p>
    <button class="bookmark-url"><span class="button-label">Go To URL</span></button>
    ` : '';


    return `
      <li class="bookmark" data-bookmark-id="${bookmark.id}">
        <div class="bookmark-header">
          <h2 class="bookmark-title">${bookmark.title}</h2>
          <ul>
            <li><button class="bookmark-edit"><span class="button-label">Edit</span></button></li>
            <li><button class="bookmark-remove"><span class="button-label">Remove</span></button></li>
          </ul>
        </div>
        <div class="bookmark-content">
          <p class="bookmark-rating">${bookmark.rating} / 5</p>${expanded}
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

  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark).closest('.bookmark').data('bookmark-id');
  }

  function handleBookmarkExpanded() {
    $('.bookmark-list').on('click', '.bookmark', event => {
      const id = getBookmarkIdFromElement(event.target);
      store.toggleBookmarkIsExpanded(id);
      // console.log(store.findById(id).isExpanded);
      render();
    });
  }
  
  function bindEventListeners() {
    handleBookmarkExpanded();
  }

  return {
    render,
    bindEventListeners
  };
}());