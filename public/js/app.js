/* ─── Config ─────────────────────────────────────────────── */
const API = '';  // همان سرور — اگه جدا شد URL رو اینجا بذار

/* ─── Helpers ────────────────────────────────────────────── */
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 3500);
}

function fmtNum(n) {
  if (n === undefined || n === null) return '—';
  return Number(n).toLocaleString('fa-IR');
}

function fmtDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleString('fa-IR', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'خطای ناشناخته');
  return json.data;
}

/* ─── Navigation ─────────────────────────────────────────── */
const pageTitles = {
  dashboard: 'داشبورد',
  'new-post': 'پست جدید',
  scheduled: 'پست‌های زمان‌بندی',
  posts: 'همه پست‌ها',
  comments: 'کامنت‌ها',
  analytics: 'آمار و آنالیز',
};

function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  const navItem = document.querySelector(`[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add('active');

  document.getElementById('pageTitle').textContent = pageTitles[pageId] || '';

  closeSidebar();

  // Lazy load page data
  if (pageId === 'dashboard') loadDashboard();
  if (pageId === 'posts') loadAllPosts();
  if (pageId === 'scheduled') loadScheduled();
  if (pageId === 'analytics') loadAnalytics();
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    navigate(el.dataset.page);
  });
});

/* ─── Sidebar Mobile ─────────────────────────────────────── */
const sidebar  = document.getElementById('sidebar');
const overlay  = document.getElementById('overlay');

document.getElementById('menuToggle').addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('hidden');
});

overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.add('hidden');
}

/* ─── Quick Post Button ──────────────────────────────────── */
document.getElementById('quickPost').addEventListener('click', () => navigate('new-post'));

/* ─── Dashboard ──────────────────────────────────────────── */
async function loadDashboard() {
  try {
    const [pageInfo, posts] = await Promise.allSettled([
      apiFetch('/api/analytics/page'),
      apiFetch('/api/posts?limit=5'),
    ]);

    if (pageInfo.status === 'fulfilled') {
      const info = pageInfo.value;
      document.getElementById('stat-fans').textContent  = fmtNum(info.fan_count || info.followers_count);
    }

    if (posts.status === 'fulfilled') {
      const items = posts.value?.data || [];
      document.getElementById('stat-posts').textContent = fmtNum(items.length);
      renderPostCards('dashboard-posts', items, false);
    } else {
      document.getElementById('dashboard-posts').innerHTML = demoPostsHTML();
    }

    // Try insights for views/engage
    try {
      const insights = await apiFetch('/api/analytics/insights?period=week');
      const data = insights?.data || [];
      const views   = data.find(d => d.name === 'page_views_total');
      const engage  = data.find(d => d.name === 'page_engaged_users');
      if (views)  document.getElementById('stat-views').textContent  = fmtNum(views.values?.[0]?.value);
      if (engage) document.getElementById('stat-engage').textContent = fmtNum(engage.values?.[0]?.value);
    } catch {}

  } catch (err) {
    document.getElementById('dashboard-posts').innerHTML = demoPostsHTML();
  }
}

function demoPostsHTML() {
  return `<div class="empty">
    <div class="empty-icon">📡</div>
    <p>توکن فیسبوک را تنظیم کنید تا پست‌ها نمایش داده شوند</p>
  </div>`;
}

/* ─── Render Posts ───────────────────────────────────────── */
function renderPostCards(containerId, posts, showDelete = true) {
  const container = document.getElementById(containerId);
  if (!posts || posts.length === 0) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">📭</div><p>پستی وجود ندارد</p></div>`;
    return;
  }

  container.innerHTML = posts.map(post => `
    <div class="post-card" id="post-${post.id}">
      <div class="post-header">
        <div>
          <div class="post-meta">${fmtDate(post.created_time)}</div>
          <div class="post-id">${post.id}</div>
        </div>
        <div class="post-actions">
          ${showDelete ? `<button class="btn btn-xs btn-secondary" onclick="loadCommentsByPost('${post.id}')">💬 کامنت‌ها</button>` : ''}
          ${showDelete ? `<button class="btn btn-xs btn-danger" onclick="deletePost('${post.id}')">🗑 حذف</button>` : ''}
        </div>
      </div>
      <div class="post-message">${(post.message || post.story || '').slice(0, 300)}${(post.message || '').length > 300 ? '...' : ''}</div>
      <div class="post-stats">
        <span>❤️ ${fmtNum(post.likes?.summary?.total_count)}</span>
        <span>💬 ${fmtNum(post.comments?.summary?.total_count)}</span>
        <span>↗ ${fmtNum(post.shares?.count)}</span>
      </div>
    </div>
  `).join('');
}

/* ─── Load All Posts ─────────────────────────────────────── */
async function loadAllPosts() {
  const container = document.getElementById('allPostsList');
  container.innerHTML = '<div class="loading">در حال بارگذاری...</div>';
  try {
    const data = await apiFetch('/api/posts?limit=20');
    renderPostCards('allPostsList', data?.data || []);
  } catch (err) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

document.getElementById('refreshPosts').addEventListener('click', loadAllPosts);

/* ─── Delete Post ────────────────────────────────────────── */
async function deletePost(postId) {
  if (!confirm('پست حذف شود؟')) return;
  try {
    await apiFetch(`/api/posts/${postId}`, { method: 'DELETE' });
    document.getElementById(`post-${postId}`)?.remove();
    toast('پست با موفقیت حذف شد', 'success');
  } catch (err) {
    toast(err.message, 'error');
  }
}

/* ─── New Post Form ──────────────────────────────────────── */
const postMessage = document.getElementById('postMessage');
postMessage.addEventListener('input', () => {
  document.getElementById('charCount').textContent = postMessage.value.length;
});

document.querySelectorAll('input[name="publishType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const schedOpts = document.getElementById('scheduleOptions');
    if (radio.value === 'schedule') {
      schedOpts.classList.remove('hidden');
      document.getElementById('submitPost').textContent = '⏰ زمان‌بندی پست';
    } else {
      schedOpts.classList.add('hidden');
      document.getElementById('submitPost').textContent = '🚀 انتشار';
    }
  });
});

document.getElementById('previewBtn').addEventListener('click', () => {
  const msg  = postMessage.value.trim();
  const link = document.getElementById('postLink').value.trim();
  const card = document.getElementById('previewCard');
  if (!msg) { toast('متن پست را وارد کنید', 'error'); return; }
  document.getElementById('previewText').textContent = msg;
  const linkEl = document.getElementById('previewLink');
  if (link) { linkEl.textContent = '🔗 ' + link; linkEl.classList.remove('hidden'); }
  else { linkEl.classList.add('hidden'); }
  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('postForm').addEventListener('submit', async e => {
  e.preventDefault();
  const message       = postMessage.value.trim();
  const link          = document.getElementById('postLink').value.trim();
  const publishType   = document.querySelector('input[name="publishType"]:checked').value;
  const scheduledTime = document.getElementById('scheduleTime').value;
  const btn           = document.getElementById('submitPost');

  if (!message) { toast('متن پست خالی است', 'error'); return; }
  if (publishType === 'schedule' && !scheduledTime) {
    toast('زمان انتشار را انتخاب کنید', 'error'); return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ در حال ارسال...';

  try {
    const body = { message };
    if (link) body.link = link;

    if (publishType === 'schedule') {
      // Use scheduler endpoint with cron — or use direct scheduledTime via Graph API
      body.scheduledTime = scheduledTime;
    }

    const data = await apiFetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    toast(`✅ پست با موفقیت ${publishType === 'schedule' ? 'زمان‌بندی' : 'منتشر'} شد!`, 'success');
    postMessage.value = '';
    document.getElementById('postLink').value = '';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('previewCard').classList.add('hidden');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = publishType === 'schedule' ? '⏰ زمان‌بندی پست' : '🚀 انتشار';
  }
});

/* ─── Scheduled Posts ────────────────────────────────────── */
async function loadScheduled() {
  const container = document.getElementById('scheduledList');
  container.innerHTML = '<div class="loading">در حال بارگذاری...</div>';
  try {
    const data = await apiFetch('/api/scheduler');
    if (!data || data.length === 0) {
      container.innerHTML = `<div class="empty"><div class="empty-icon">🕐</div><p>هیچ پست زمان‌بندی شده‌ای وجود ندارد</p></div>`;
      return;
    }
    container.innerHTML = data.map(item => `
      <div class="scheduled-item">
        <span>⏰</span>
        <div class="scheduled-msg">${item.message.slice(0, 80)}${item.message.length > 80 ? '...' : ''}</div>
        <div class="scheduled-time">${item.cronExpression}</div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

/* ─── Comments ───────────────────────────────────────────── */
document.getElementById('loadComments').addEventListener('click', () => {
  const postId = document.getElementById('commentPostId').value.trim();
  if (!postId) { toast('آی‌دی پست را وارد کنید', 'error'); return; }
  fetchComments(postId);
});

async function loadCommentsByPost(postId) {
  navigate('comments');
  document.getElementById('commentPostId').value = postId;
  await fetchComments(postId);
}

async function fetchComments(postId) {
  const container = document.getElementById('commentsList');
  container.innerHTML = '<div class="loading">در حال بارگذاری...</div>';
  try {
    const data = await apiFetch(`/api/comments/${postId}`);
    const comments = data?.data || [];
    if (comments.length === 0) {
      container.innerHTML = `<div class="empty"><div class="empty-icon">💬</div><p>کامنتی وجود ندارد</p></div>`;
      return;
    }
    container.innerHTML = comments.map(c => `
      <div class="comment-card" id="comment-${c.id}">
        <div class="comment-header">
          <span class="comment-author">${c.from?.name || 'ناشناس'}</span>
          <span class="comment-time">${fmtDate(c.created_time)}</span>
        </div>
        <div class="comment-text">${c.message}</div>
        <div class="post-actions">
          <div class="reply-form">
            <input type="text" placeholder="پاسخ بنویسید..." id="reply-${c.id}" />
            <button class="btn btn-xs btn-primary" onclick="sendReply('${c.id}')">ارسال</button>
          </div>
          <button class="btn btn-xs btn-danger" onclick="removeComment('${c.id}')">🗑 حذف</button>
          <button class="btn btn-xs btn-secondary" onclick="toggleHide('${c.id}', true)">🙈 مخفی</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

async function sendReply(commentId) {
  const input = document.getElementById(`reply-${commentId}`);
  const message = input.value.trim();
  if (!message) { toast('متن پاسخ را بنویسید', 'error'); return; }
  try {
    await apiFetch(`/api/comments/${commentId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    input.value = '';
    toast('پاسخ ارسال شد ✅', 'success');
  } catch (err) { toast(err.message, 'error'); }
}

async function removeComment(commentId) {
  if (!confirm('کامنت حذف شود؟')) return;
  try {
    await apiFetch(`/api/comments/${commentId}`, { method: 'DELETE' });
    document.getElementById(`comment-${commentId}`)?.remove();
    toast('کامنت حذف شد', 'success');
  } catch (err) { toast(err.message, 'error'); }
}

async function toggleHide(commentId, hide) {
  try {
    await apiFetch(`/api/comments/${commentId}/hide`, {
      method: 'PATCH',
      body: JSON.stringify({ hide }),
    });
    toast(hide ? 'کامنت مخفی شد' : 'کامنت نمایش داده شد', 'success');
  } catch (err) { toast(err.message, 'error'); }
}

/* ─── Analytics ──────────────────────────────────────────── */
document.getElementById('analyticsPeriod').addEventListener('change', loadAnalytics);

async function loadAnalytics() {
  const period = document.getElementById('analyticsPeriod').value;
  const container = document.getElementById('analyticsData');
  container.innerHTML = '<div class="loading">در حال بارگذاری...</div>';

  try {
    const [pageInfo, insights] = await Promise.all([
      apiFetch('/api/analytics/page'),
      apiFetch(`/api/analytics/insights?period=${period}`),
    ]);

    const metrics = {};
    (insights?.data || []).forEach(m => {
      const val = m.values?.[m.values.length - 1]?.value;
      metrics[m.name] = typeof val === 'object' ? Object.values(val).reduce((a, b) => a + b, 0) : val;
    });

    container.innerHTML = `
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="analytics-metric">${fmtNum(pageInfo?.fan_count)}</div>
          <div class="analytics-label">👥 کل دنبال‌کنندگان</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-metric">${fmtNum(metrics['page_impressions'])}</div>
          <div class="analytics-label">👁 بازدید کل</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-metric">${fmtNum(metrics['page_impressions_unique'])}</div>
          <div class="analytics-label">👤 بازدید یکتا</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-metric">${fmtNum(metrics['page_engaged_users'])}</div>
          <div class="analytics-label">❤️ کاربران متعامل</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-metric">${fmtNum(metrics['page_fans_adds'])}</div>
          <div class="analytics-label">➕ فالوور جدید</div>
        </div>
        <div class="analytics-card">
          <div class="analytics-metric">${fmtNum(metrics['page_views_total'])}</div>
          <div class="analytics-label">🔍 بازدید صفحه</div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">اطلاعات صفحه فروشهایپ</div>
        <p><strong>نام:</strong> ${pageInfo?.name || '—'}</p>
        <p style="margin-top:8px"><strong>درباره:</strong> ${pageInfo?.about || '—'}</p>
        <p style="margin-top:8px"><strong>آیدی:</strong> <code>${pageInfo?.id || '—'}</code></p>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

/* ─── Init ───────────────────────────────────────────────── */
navigate('dashboard');
