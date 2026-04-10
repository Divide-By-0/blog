(function () {
  var section = document.getElementById('comments-section');
  if (!section) return;

  var endpoint = section.dataset.endpoint;
  var slug = section.dataset.slug;
  var listEl = document.getElementById('comments-list');
  var form = document.getElementById('comment-form');
  var statusEl = document.getElementById('comment-form-status');
  var cancelBtn = document.getElementById('cancel-reply');
  var parentIdInput = form.querySelector('input[name="parentId"]');
  var formTitle = section.querySelector('.comment-form-wrapper h3');

  // ---- Fetch & render ----

  function loadComments() {
    fetch(endpoint + '?slug=' + encodeURIComponent(slug), { redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (comments) { renderComments(comments); })
      .catch(function () {
        listEl.innerHTML = '<p class="comments-empty">Could not load comments.</p>';
      });
  }

  function renderComments(comments) {
    if (!comments || comments.length === 0) {
      listEl.innerHTML = '<p class="comments-empty">No comments yet. Be the first!</p>';
      return;
    }

    // Separate top-level and replies
    var topLevel = [];
    var repliesMap = {}; // parentId -> [replies]
    comments.forEach(function (c) {
      if (c.parentId) {
        if (!repliesMap[c.parentId]) repliesMap[c.parentId] = [];
        repliesMap[c.parentId].push(c);
      } else {
        topLevel.push(c);
      }
    });

    var html = '';
    topLevel.forEach(function (c) {
      html += renderComment(c, repliesMap[c.id] || []);
    });
    listEl.innerHTML = html;

    // Attach reply button handlers
    listEl.querySelectorAll('.comment-reply-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        startReply(btn.dataset.id, btn.dataset.name);
      });
    });
  }

  function renderComment(comment, replies) {
    var html = '<div class="comment" id="comment-' + escHtml(comment.id) + '">';
    html += '<div class="comment-meta">';
    html += '<span class="comment-name">' + escHtml(comment.name || 'Anonymous') + '</span>';
    if (comment.email) {
      html += ' &middot; <span class="comment-email">' + escHtml(comment.email) + '</span>';
    }
    html += ' &middot; <span class="comment-date">' + formatDate(comment.timestamp) + '</span>';
    html += '</div>';
    html += '<div class="comment-body">' + escHtml(comment.comment).replace(/\n/g, '<br>') + '</div>';
    html += '<button class="comment-reply-btn" data-id="' + escHtml(comment.id) +
            '" data-name="' + escHtml(comment.name || 'Anonymous') + '">Reply</button>';

    if (replies.length > 0) {
      html += '<div class="comment-replies">';
      replies.forEach(function (r) {
        html += renderComment(r, []);
      });
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // ---- Reply mode ----

  function startReply(parentId, parentName) {
    parentIdInput.value = parentId;
    formTitle.textContent = 'Replying to ' + parentName;
    cancelBtn.style.display = 'inline-block';
    form.querySelector('textarea').focus();
    // Scroll form into view
    section.querySelector('.comment-form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  cancelBtn.addEventListener('click', function () {
    parentIdInput.value = '';
    formTitle.textContent = 'Leave a comment';
    cancelBtn.style.display = 'none';
  });

  // ---- Submit ----

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot check — if filled, silently ignore (it's a bot)
    if (form.querySelector('input[name="website"]').value) return;

    var data = {
      slug: slug,
      parentId: parentIdInput.value || null,
      name: form.querySelector('input[name="name"]').value.trim(),
      email: form.querySelector('input[name="email"]').value.trim(),
      comment: form.querySelector('textarea[name="comment"]').value.trim()
    };

    if (!data.comment) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    statusEl.textContent = '';

    // NOTE: Content-Type text/plain avoids CORS preflight for Google Apps Script
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain' },
      redirect: 'follow'
    })
      .then(function (r) { return r.json(); })
      .then(function (resp) {
        if (resp.success) {
          form.reset();
          parentIdInput.value = '';
          formTitle.textContent = 'Leave a comment';
          cancelBtn.style.display = 'none';
          statusEl.textContent = 'Comment posted!';
          statusEl.className = 'comment-form-status success';
          loadComments();
        } else {
          statusEl.textContent = resp.error || 'Something went wrong.';
          statusEl.className = 'comment-form-status error';
        }
      })
      .catch(function () {
        statusEl.textContent = 'Could not post comment. Try again.';
        statusEl.className = 'comment-form-status error';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Comment';
      });
  });

  // ---- Helpers ----

  function escHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      var now = new Date();
      var diffMs = now - d;
      var diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return diffMins + 'm ago';
      var diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return diffHrs + 'h ago';
      var diffDays = Math.floor(diffHrs / 24);
      if (diffDays < 30) return diffDays + 'd ago';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  // ---- Init ----
  loadComments();
})();
