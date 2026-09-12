const API_BASE = 'https://nexsoft-notes-app.onrender.com/api';

let allNotes = [];
let activeCategory = '';
let selectedColor = '#00f5ff';
let noteModal = null;

// Makes authenticated API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('notes-token');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  const response = await fetch(API_BASE + endpoint, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Shows auth page message
function showAuthMessage(message, type = 'error') {
  $('#auth-message')
    .removeClass('d-none')
    .text(message)
    .css('color', type === 'success' ? '#00ff88' : '#ff3860')
    .css('background', type === 'success' ? 'rgba(0,255,136,0.12)' : 'rgba(255,56,96,0.12)');
}

// Shows a brief toast confirmation (success/error) on the dashboard
let toastTimeoutId = null;
function showToast(message, type = 'success') {
  const toast = $('#toast');
  if (toast.length === 0) return;

  clearTimeout(toastTimeoutId);

  toast
    .removeClass('d-none toast-error')
    .toggleClass('toast-error', type === 'error')
    .text(message);

  toastTimeoutId = setTimeout(() => toast.addClass('d-none'), 3000);
}

// Reflects browser online/offline status in the offline banner
function updateOnlineStatus() {
  $('#offline-banner').toggleClass('d-none', navigator.onLine);
}

// Handles user login
async function handleLogin(email, password) {
  const data = await apiCall('/auth/login', 'POST', { email, password });
  localStorage.setItem('notes-token', data.token);
  localStorage.setItem('notes-user', JSON.stringify(data.user));
  window.location.href = 'dashboard.html';
}

// Handles new user registration
async function handleRegister(name, email, password) {
  const data = await apiCall('/auth/register', 'POST', { name, email, password });
  localStorage.setItem('notes-token', data.token);
  localStorage.setItem('notes-user', JSON.stringify(data.user));
  window.location.href = 'dashboard.html';
}

// Checks if dashboard user is logged in
async function checkAuth() {
  const token = localStorage.getItem('notes-token');

  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const user = await apiCall('/auth/me');
    $('#sidebar-user-name').text(user.name);
  } catch (error) {
    localStorage.removeItem('notes-token');
    localStorage.removeItem('notes-user');
    window.location.href = 'index.html';
  }
}

// Loads notes from backend
async function loadNotes(search = '', category = activeCategory) {
  let endpoint = '/notes';
  const queryParams = [];

  if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
  if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
  if (queryParams.length > 0) endpoint += `?${queryParams.join('&')}`;

  const loadingState = $('#loading-state');
  const slowMsg = $('#loading-slow-msg');

  $('#empty-state').addClass('d-none');
  $('#notes-grid').empty();
  loadingState.removeClass('d-none');
  slowMsg.addClass('d-none');

  const slowTimeoutId = setTimeout(() => slowMsg.removeClass('d-none'), 5000);

  try {
    allNotes = await apiCall(endpoint);
    renderNotes(allNotes);
    updateStats(allNotes);
    renderCategories(allNotes);
  } finally {
    clearTimeout(slowTimeoutId);
    loadingState.addClass('d-none');
  }
}

// Renders all note cards
function renderNotes(notes) {
  const notesGrid = $('#notes-grid');
  const emptyState = $('#empty-state');

  notesGrid.empty();

  if (notes.length === 0) {
    emptyState.removeClass('d-none');
    return;
  }

  emptyState.addClass('d-none');

  notes.forEach(function (note) {
    notesGrid.append(buildNoteCard(note));
  });
}

// Builds one note card
function buildNoteCard(note) {
  const noteDate = new Date(note.updatedAt).toLocaleDateString();

  return `
    <article class="note-card ${note.isPinned ? 'pinned' : ''}" data-id="${note._id}" style="border-top-color:${note.color}">
      ${note.isPinned ? '<i class="bi bi-pin-angle-fill pin-indicator"></i>' : ''}
      <h2>${escapeHtml(note.title)}</h2>
      <p class="note-content-preview">${escapeHtml(note.content)}</p>

      <div class="note-meta">
        <span class="note-category" style="color:${note.color}">${escapeHtml(note.category)}</span>
        <span class="note-date">${noteDate}</span>
      </div>

      <div class="note-actions">
        <button class="note-action-btn pin-btn" title="Pin note"><i class="bi bi-pin-angle"></i></button>
        <button class="note-action-btn edit-btn" title="Edit note"><i class="bi bi-pencil"></i></button>
        <button class="note-action-btn delete-btn" title="Delete note"><i class="bi bi-trash"></i></button>
      </div>
    </article>
  `;
}

// Opens add or edit note modal
function openNoteModal(note = null) {
  $('#note-form-message').addClass('d-none').text('');

  if (note) {
    $('#note-modal-title').text('Edit Note');
    $('#note-id').val(note._id);
    $('#note-title').val(note.title);
    $('#note-content').val(note.content);
    $('#note-category').val(note.category);
    $('#note-pinned').prop('checked', note.isPinned);
    selectedColor = note.color;
  } else {
    $('#note-modal-title').text('Add Note');
    $('#note-form')[0].reset();
    $('#note-id').val('');
    selectedColor = '#00f5ff';
  }

  $('.color-swatch').removeClass('active');
  $(`.color-swatch[data-color="${selectedColor}"]`).addClass('active');
  noteModal.show();
}

// Validates required note fields before submit
function validateNoteForm(noteData) {
  if (!noteData.title) return 'Title is required.';
  if (!noteData.content) return 'Content is required.';
  return null;
}

// Saves note to backend
async function saveNote() {
  const noteId = $('#note-id').val();

  const noteData = {
    title: $('#note-title').val().trim(),
    content: $('#note-content').val().trim(),
    category: $('#note-category').val(),
    color: selectedColor,
    isPinned: $('#note-pinned').is(':checked')
  };

  const validationError = validateNoteForm(noteData);
  if (validationError) {
    $('#note-form-message').removeClass('d-none').text(validationError);
    return;
  }

  if (!navigator.onLine) {
    $('#note-form-message').removeClass('d-none').text('You are offline. Reconnect and try again.');
    return;
  }

  if (noteId) {
    await apiCall(`/notes/${noteId}`, 'PUT', noteData);
  } else {
    await apiCall('/notes', 'POST', noteData);
  }

  noteModal.hide();
  await loadNotes($('#search-input').val().trim(), activeCategory);
  showToast(noteId ? 'Note updated successfully.' : 'Note created successfully.');
}

// Toggles note pin status
async function togglePin(noteId) {
  await apiCall(`/notes/${noteId}/pin`, 'PATCH');
  await loadNotes($('#search-input').val().trim(), activeCategory);
}

// Handles debounced search
function handleSearch() {
  const query = $('#search-input').val().trim();
  $('#clear-search-btn').toggleClass('d-none', query.length === 0);
  loadNotes(query, activeCategory);
}

// Handles category filter
function handleCategoryFilter(category) {
  activeCategory = category;
  $('.category-pill').removeClass('active');
  $(`.category-pill[data-category="${category}"]`).addClass('active');
  loadNotes($('#search-input').val().trim(), activeCategory);
}

// Handles logout
function handleLogout() {
  localStorage.removeItem('notes-token');
  localStorage.removeItem('notes-user');
  window.location.href = 'index.html';
}

// Updates dashboard stats
function updateStats(notes) {
  const pinnedCount = notes.filter(note => note.isPinned).length;
  const categories = new Set(notes.map(note => note.category));

  $('#total-notes').text(notes.length);
  $('#pinned-notes').text(pinnedCount);
  $('#category-count').text(categories.size);
}

// Renders category buttons from notes
function renderCategories(notes) {
  const categoryList = $('#category-list');
  const categories = [...new Set(notes.map(note => note.category))];

  categoryList.html('<button class="category-pill active" data-category="">All</button>');

  categories.forEach(function (category) {
    categoryList.append(`<button class="category-pill" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`);
  });

  $('.category-pill').removeClass('active');
  $(`.category-pill[data-category="${activeCategory}"]`).addClass('active');
}

// Toggles mobile sidebar
function toggleSidebar() {
  $('#sidebar').toggleClass('open');
  $('#sidebar-overlay').toggleClass('show');
}

// Delays function execution
function debounce(fn, delay) {
  let timeoutId;

  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
}

// Escapes HTML to prevent unsafe rendering
function escapeHtml(text) {
  return $('<div>').text(text).html();
}

$(document).ready(async function () {
  updateOnlineStatus();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  if ($('#login-form').length) {
    $('#show-register-btn').on('click', function () {
      $('#login-form').addClass('d-none');
      $('#register-form').removeClass('d-none');
      $('#auth-message').addClass('d-none');
    });

    $('#show-login-btn').on('click', function () {
      $('#register-form').addClass('d-none');
      $('#login-form').removeClass('d-none');
      $('#auth-message').addClass('d-none');
    });

    $('#login-form').on('submit', async function (event) {
      event.preventDefault();

      try {
        await handleLogin($('#login-email').val().trim(), $('#login-password').val());
      } catch (error) {
        showAuthMessage(error.message);
      }
    });

    $('#register-form').on('submit', async function (event) {
      event.preventDefault();

      try {
        await handleRegister(
          $('#register-name').val().trim(),
          $('#register-email').val().trim(),
          $('#register-password').val()
        );
      } catch (error) {
        showAuthMessage(error.message);
      }
    });
  }

  if ($('#note-modal').length) {
    noteModal = new bootstrap.Modal(document.getElementById('note-modal'));
    await checkAuth();
    await loadNotes();

    $('#add-note-btn, #desktop-add-note-btn').on('click', () => openNoteModal());

    $('.color-swatch').on('click', function () {
      selectedColor = $(this).data('color');
      $('.color-swatch').removeClass('active');
      $(this).addClass('active');
    });

    $('#note-form').on('submit', async function (event) {
      event.preventDefault();

      try {
        await saveNote();
      } catch (error) {
        $('#note-form-message').removeClass('d-none').text(error.message);
      }
    });

    $('#notes-grid').on('click', '.edit-btn', function () {
      const noteId = $(this).closest('.note-card').data('id');
      const note = allNotes.find(item => item._id === noteId);
      openNoteModal(note);
    });

    $('#notes-grid').on('click', '.delete-btn', function () {
      const noteCard = $(this).closest('.note-card');

      if (noteCard.find('.delete-confirm').length === 0) {
        noteCard.append(`
          <div class="delete-confirm">
            <p>Delete this note?</p>
            <button class="btn btn-sm btn-danger confirm-delete-btn">Yes, delete</button>
            <button class="btn btn-sm btn-secondary cancel-delete-btn">Cancel</button>
          </div>
        `);
      }
    });

    $('#notes-grid').on('click', '.confirm-delete-btn', async function () {
      const noteCard = $(this).closest('.note-card');
      const noteId = noteCard.data('id');

      await apiCall(`/notes/${noteId}`, 'DELETE');
      await loadNotes($('#search-input').val().trim(), activeCategory);
    });

    $('#notes-grid').on('click', '.cancel-delete-btn', function () {
      $(this).closest('.delete-confirm').remove();
    });

    $('#notes-grid').on('click', '.pin-btn', function () {
      togglePin($(this).closest('.note-card').data('id'));
    });

    $('#search-input').on('input', debounce(handleSearch, 400));

    $('#clear-search-btn').on('click', function () {
      $('#search-input').val('');
      $(this).addClass('d-none');
      loadNotes('', activeCategory);
    });

    $('#category-list').on('click', '.category-pill', function () {
      handleCategoryFilter($(this).data('category'));
    });

    $('#hamburger-btn, #sidebar-overlay').on('click', toggleSidebar);
    $('#logout-btn').on('click', handleLogout);

    $('#grid-view-btn').on('click', function () {
      $('#notes-grid').removeClass('list-view');
      $('.view-btn').removeClass('active');
      $(this).addClass('active');
    });

    $('#list-view-btn').on('click', function () {
      $('#notes-grid').addClass('list-view');
      $('.view-btn').removeClass('active');
      $(this).addClass('active');
    });
  }
});