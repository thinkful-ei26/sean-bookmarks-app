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
    <button class="bookmark-url">Go To URL</button>
    ` : '';
    const editing = bookmark.isEditing ? `
    <form id="edit-bookmark-form">
      <div class="input-group">
        <label for="bookmark-edit-title">Title:</label>
        <input type="text" name="edit-title" id="bookmark-edit-title" value="${bookmark.title}" readonly required>
      </div>
      <div class="input-group">
        <label for="bookmark-edit-url">URL:</label>
        <input type="url" name="edit-url" id="bookmark-edit-url" value="${bookmark.url}" required>
      </div>
      <div class="input-group">
        <label for="bookmark-edit-desc">Description:</label>
        <input type="text" name="edit-desc" id="bookmark-edit-desc" value="${bookmark.desc}">
      </div>
      <div class="input-group">
        <label for="bookmark-edit-rating">Rating:</label>
        <input type="number" name="edit-rating" id="bookmark-edit-rating" value="${bookmark.rating}">
      </div>
      <button id="bookmark-edit-submit" type="submit">Submit</button>
    </form>
    ` : '';
    // NOTE: these values CAN be edited in chrome, but only if they are tabbed to (I haven't tested how other browsers
    // handle a default value)

    return `
      <li class="bookmark" data-bookmark-id="${bookmark.id}">
        <div class="bookmark-header">
          <h2 class="bookmark-title">${bookmark.title}</h2>
          <ul>
            <li><button class="bookmark-edit">Edit</button></li>
            <li><button class="bookmark-remove">Remove</button></li>
          </ul>
        </div>
        <div class="bookmark-content">
          <p class="bookmark-rating">${bookmark.rating} / 5</p>${expanded}${editing}
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

  function visitPage(id) {
    window.open(store.findById(id).url);
  }

  function handleBookmarkExpanded() {
    $('.bookmark-list').on('click', '.bookmark', event => {
      const id = getBookmarkIdFromElement(event.target);
      store.toggleBookmarkIsExpanded(id);
      // console.log(store.findById(id).isExpanded);
      render();
    });
  }

  function handleURLClicked() {
    $('.bookmark-list').on('click', '.bookmark-url', event => {
      event.stopPropagation();
      // console.log('event fired');
      visitPage(getBookmarkIdFromElement(event.currentTarget));
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
      }, (error) => window.alert(error.responseJSON.message));
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
      event.stopPropagation();
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

  function handleEditBookmarkClicked() {
    $('.bookmark-list').on('click', '.bookmark-edit', event => {
      event.stopPropagation();
      // console.log('event fired');
      const id = getBookmarkIdFromElement(event.currentTarget);
      store.toggleBookmarkIsEditing(id);
      render();
    });
  }

  function handleEditBookmarkSubmit() {
    // have to use click on the button instead of submint on the form because I'm getting an error: Form submission
    // canceled because the form is not connected
    $('.bookmark-list').on('click', '#bookmark-edit-submit', event => {
      event.preventDefault();
      event.stopPropagation();
      // console.log('event fired');
      const id = getBookmarkIdFromElement(event.currentTarget);
      const editBookmarkData = {};
      editBookmarkData.title = $('#bookmark-edit-title').val();
      editBookmarkData.url = $('#bookmark-edit-url').val();
      if ($('#bookmark-edit-desc').val()) editBookmarkData.desc = $('#bookmark-edit-desc').val();
      if ($('#bookmark-edit-rating').val()) editBookmarkData.rating = $('#bookmark-edit-rating').val();
      api.updateBookmark(id, editBookmarkData, () => {
        store.findAndUpdate(id, editBookmarkData);
        store.toggleBookmarkIsEditing(id);
        render();
      }, (error) => window.alert(error.responseJSON.message));
    });
  }
  
  function bindEventListeners() {
    handleBookmarkExpanded();
    handleURLClicked();
    handleNewBookmarkClicked();
    handleNewBookmarkSubmit();
    handleNewBookmarkCancel();
    handleDeleteBookmarkClicked();
    handleMinimumRatingChanged();
    handleEditBookmarkClicked();
    handleEditBookmarkSubmit();
  }

  return {
    render,
    bindEventListeners
  };
}());