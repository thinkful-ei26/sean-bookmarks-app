/* global store, api */
/* eslint-env jquery */
'use strict';

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function() {
  function generateCreateBookmarkForm() {
    // console.log('create form ran');
    return `
      <div class="input-group">
        <label for="bookmark-new-title">Title:</label>
        <input type="text" name="new-title" id="bookmark-new-title" required>
      </div>
      <div class="input-group">
        <label for="bookmark-new-url">URL:</label>
        <input type="url" name="new-url" id="bookmark-new-url" required>
      </div>
      <div class="input-group">
        <label for="bookmark-new-desc">Description:</label>
        <input type="text" name="new-desc" id="bookmark-new-desc">
      </div>
      <div class="input-group">
        <label for="bookmark-new-rating">Rating:</label>
        <input type="number" name="new-rating" id="bookmark-new-rating" min="1" max="5">
      </div>
      <button id="bookmark-new-submit" type="submit">Submit</button><button id="bookmark-new-cancel" type="button">Cancel</button>
    `;
  }

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
    // POSSIBLE STRETCH GOAL: hide new-bookmark and minimum-rating when creating a bookmark
    if (store.create) {
      const formString = generateCreateBookmarkForm();
      $('#add-bookmark-form').html(formString);
    } else {
      $('#add-bookmark-form').html('');
    }

    let bookmarks = [...store.bookmarks];
    if (store.minimumRating) bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.minimumRating);

    const bookmarksString = generateBookmarksString(bookmarks);
    $('.bookmark-list').html(bookmarksString);
  }

  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark).closest('.bookmark').data('bookmark-id');
  }

  // POSSIBLE STRETCH GOAL: do not call this when edit or remove buttons are clicked
  function handleBookmarkExpanded() {
    $('.bookmark-list').on('click', '.bookmark', event => {
      const id = getBookmarkIdFromElement(event.target);
      store.toggleBookmarkIsExpanded(id);
      // console.log(store.findById(id).isExpanded);
      render();
    });
  }

  function handleNewBookmarkClicked() {
    $('.new-bookmark').on('click', event => {
      event.preventDefault();
      // console.log('button clicked');
      store.setCreate(true);
      render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('#add-bookmark-form').on('submit', event => {
      event.preventDefault();
      // console.log('event fired');
      const newBookmarkData = {};
      newBookmarkData.title = $('#bookmark-new-title').val();
      newBookmarkData.url = $('#bookmark-new-url').val();
      if ($('#bookmark-new-desc').val()) newBookmarkData.desc = $('#bookmark-new-desc').val();
      if ($('#bookmark-new-rating').val()) newBookmarkData.rating = $('#bookmark-new-rating').val();
      api.createBookmark(newBookmarkData, newBookmark => {
        store.addBookmark(newBookmark);
        store.setCreate(false);
        render();
      }, (error) => {window.alert(error.responseJSON.message);});
    });
  }

  function handleNewBookmarkCancel() {
    $('#add-bookmark-form').on('click', '#bookmark-new-cancel', event => {
      // console.log('event fired');
      event.preventDefault();
      store.setCreate(false);
      render();
    });
  }

  function handleDeleteBookmarkClicked() {
    $('.bookmark-list').on('click', '.bookmark-remove', event => {
      // console.log('event fired');
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id, () => {
        store.findAndDelete(id);
        render();
      }, (error) => {window.alert(error.responseJSON.message);});
    });
  }

  function handleMinimumRatingChanged() {
    $('#bookmark-rating-filter').on('input', event => {
      // console.log('event fired');
      const val = $(event.currentTarget)[0].options.selectedIndex + 1;
      // console.log(val);
      store.setMinimumRating(val);
      render();
    });
  }
  
  function bindEventListeners() {
    handleBookmarkExpanded();
    handleNewBookmarkClicked();
    handleNewBookmarkSubmit();
    handleNewBookmarkCancel();
    handleDeleteBookmarkClicked();
    handleMinimumRatingChanged();
  }

  return {
    render,
    bindEventListeners
  };
}());