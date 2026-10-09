'use strict';
(() => {
  if (!Store.getCurrentUser()) {
    location.replace('login.html');
    return;
  }
  const {
    escape: e,
    icon,
    primary,
    secondary,
    button,
    input,
    label,
    eyebrow,
    avatar,
    card,
  } = UI;
  const main = UI.shell('home');
  let filter = 'all',
    query = '';
  const categories = {
    p1: ['Field notes', 'bg-sage'],
    p2: ['In the studio', 'bg-lilac'],
    p3: ['A little reminder', 'bg-gold/30'],
    p4: ['Out & about', 'bg-peach'],
    p5: ['Work in progress', 'bg-lilac'],
  };
  function postCard(post, index) {
    const author = Store.getUserById(post.authorId),
      me = Store.getCurrentUser();
    const selected = Array.isArray(post.audience);
    const [category, tint] = categories[post.id] || [
      'From your circle',
      'bg-sage',
    ];
    const art =
      post.id === 'p1'
        ? 'assets/botanical.svg'
        : post.id === 'p4'
          ? 'assets/hills.svg'
          : null;
    const liked = post.likes.includes(me.id),
      disliked = post.dislikes.includes(me.id);
    return `<article class="${card} flex flex-col overflow-hidden transition duration-300 motion-safe:hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none" data-post="${e(post.id)}" data-enter><div class="flex items-center justify-between gap-3 px-5 pt-5"><span class="${eyebrow} rounded-full px-3 py-1.5 ${tint}">${category}</span><span class="font-display text-sm text-muted/60">${String(index + 1).padStart(2, '0')}</span></div>${art ? `<img src="${art}" alt="${post.id === 'p1' ? 'Original botanical illustration of valley wildflowers' : 'Illustrated mountain postcard from Hunza'}" class="mt-4 h-36 w-full object-cover">` : ''}<div class="flex flex-1 flex-col p-5"><p class="flex-1 whitespace-pre-wrap break-words text-[15px] leading-7">${e(post.text)}</p><div class="mt-6 flex items-center gap-3 border-t border-line pt-4"><a href="profile.html?user=${e(author.id)}" aria-label="View ${e(author.name)}'s profile">${avatar(author, 38, 'rounded-xl')}</a><div class="min-w-0 flex-1"><a href="profile.html?user=${e(author.id)}" class="block truncate text-xs font-semibold hover:text-forest">${e(author.name)}${author.id === me.id ? ' · You' : ''}</a><p class="mt-1 text-[10px] text-muted">Last login · <time datetime="${e(author.lastLogin || '')}">${Store.timeAgo(author.lastLogin)}</time></p></div><span class="text-[10px] text-muted" title="Shared ${e(new Date(post.timestamp).toLocaleString())}">${Store.timeAgo(post.timestamp)}</span></div><div class="mt-4 flex flex-wrap items-center justify-between gap-2"><div class="flex gap-1"><button type="button" data-react="like" data-id="${e(post.id)}" aria-label="Like update by ${e(author.name)}" aria-pressed="${liked}" class="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs transition ${liked ? 'bg-sage text-forest font-semibold' : 'text-muted hover:bg-paper'}">${icon('like', 'w-4 h-4')}<span>${post.likes.length}</span></button><button type="button" data-react="dislike" data-id="${e(post.id)}" aria-label="Dislike update by ${e(author.name)}" aria-pressed="${disliked}" class="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs transition ${disliked ? 'bg-peach text-ink font-semibold' : 'text-muted hover:bg-paper'}">${icon('dislike', 'w-4 h-4')}<span>${post.dislikes.length}</span></button></div><span class="inline-flex items-center gap-1 text-[10px] text-muted" title="${selected ? 'Visible only to the chosen friends and its author' : 'Visible to the author and all their friends'}">${icon(selected ? 'lock' : 'people', 'w-3 h-3')}${selected ? 'Selected friends' : 'All friends'}</span></div></div></article>`;
  }
  function filteredPosts() {
    const me = Store.getCurrentUser();
    let posts = Store.getVisiblePosts(me.id).filter((post) =>
      `${post.text} ${Store.getUserById(post.authorId).name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
    if (filter === 'mine')
      posts = posts.filter((post) => post.authorId === me.id);
    if (filter === 'selected')
      posts = posts.filter((post) => Array.isArray(post.audience));
    if (filter === 'popular')
      posts.sort((a, b) => b.likes.length - a.likes.length);
    return posts;
  }
  function renderFeed() {
    const posts = filteredPosts();
    document.getElementById('postCount').textContent =
      `${posts.length} update${posts.length === 1 ? '' : 's'}`;
    document.getElementById('feed').innerHTML = posts.length
      ? posts.map(postCard).join('')
      : `<div class="sm:col-span-2">${UI.empty(query ? 'No matching updates' : 'A fresh page, just for you', query ? 'Try another name or keyword.' : 'Connect with people or share your first update to bring this board to life.')}</div>`;
    document.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.className = `rounded-full px-3.5 py-2 text-xs font-semibold transition ${btn.dataset.filter === filter ? 'bg-ink text-white' : 'text-muted hover:bg-white'}`;
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
    });
  }
  function render() {
    const me = Store.getCurrentUser(),
      friends = Store.getFriendsSortedByLogin(me.id),
      pending = Store.getPendingRequests(me.id);
    main.innerHTML = `<section class="relative mb-8 overflow-hidden rounded-3xl border border-line bg-sage p-6 sm:p-8" data-enter><div class="relative z-10 max-w-xl xl:max-w-[58%]"><div class="mb-4 flex items-center gap-2"><p class="${eyebrow} text-forest">Home</p></div><h1 class="font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl">Your news board</h1><p class="mt-4 max-w-md text-sm leading-6 text-ink/65">Welcome back, ${e(me.name.split(' ')[0])}. Read the latest updates from your friends or share your own.</p><button type="button" data-compose class="${primary} mt-6">${icon('plus', 'w-4 h-4')} Write an update</button></div><img src="assets/desk.svg" alt="" aria-hidden="true" width="560" height="320" class="absolute right-6 top-1/2 hidden w-[36%] -translate-y-1/2 rounded-2xl xl:block"></section><div class="grid gap-7 xl:grid-cols-[minmax(0,1fr)_290px]"><section class="min-w-0"><div class="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p class="${eyebrow} mb-2 text-forest">Shared updates</p><h2 class="font-display text-2xl">Latest news</h2></div><span id="postCount" class="rounded-full border border-line px-3 py-1 text-[10px] text-muted"></span></div><div class="mb-5 flex flex-wrap items-center gap-2"><div class="flex flex-wrap gap-1" aria-label="Filter updates">${[
      ['all', 'All updates'],
      ['mine', 'By you'],
      ['selected', 'Selected circle'],
      ['popular', 'Most liked'],
    ]
      .map(
        ([key, title]) =>
          `<button type="button" data-filter="${key}" aria-pressed="false">${title}</button>`,
      )
      .join(
        '',
      )}</div><label class="relative ml-auto w-full sm:max-w-[180px]"><span class="sr-only">Search updates</span><span class="pointer-events-none absolute left-3 top-2.5 text-muted">${icon('search', 'h-4 w-4')}</span><input id="feedSearch" type="search" class="w-full rounded-full border border-line bg-transparent py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-forest/20" placeholder="Find an update…" value="${e(query)}"></label></div><div id="feed" class="grid items-stretch gap-5 sm:grid-cols-2"></div></section><aside class="space-y-5"><section class="${card} p-5" data-enter><div class="flex items-center justify-between"><h2 class="font-display text-xl">Your circle</h2><span class="grid h-6 w-6 place-items-center rounded-full bg-paper text-[10px] font-semibold">${friends.length}</span></div><p class="mt-1 text-[10px] text-muted">Ordered by most recent login</p><ol class="mt-5 divide-y divide-line">${friends.map((friend, index) => `<li class="flex items-center gap-3 py-4 first:pt-0"><span class="w-3 text-[10px] text-muted">${index + 1}</span><a href="profile.html?user=${friend.id}">${avatar(friend, 40, 'rounded-xl')}</a><div class="min-w-0 flex-1"><a href="profile.html?user=${friend.id}" class="block truncate text-xs font-semibold hover:text-forest">${e(friend.name)}</a><p class="mt-1 text-[10px] text-muted">${Store.timeAgo(friend.lastLogin)}</p></div><button type="button" data-rate="${friend.id}" class="rounded-lg px-1.5 py-2 transition hover:bg-sage" aria-label="Rate ${e(friend.name)}" title="${Store.getRatingLabel(Store.getRating(me.id, friend.id))}"><span aria-hidden="true">${UI.ratingMark(Store.getRating(me.id, friend.id))}</span></button></li>`).join('')}</ol>${friends.length ? '' : '<p class="py-5 text-xs text-muted">Your first connection is one invitation away.</p>'}<a href="network.html" class="mt-3 flex items-center justify-between border-t border-line pt-4 text-xs font-semibold text-forest">Grow your circle ${icon('arrow', 'w-4 h-4')}</a></section>${pending.length ? `<a href="network.html#invitations" class="block rounded-2xl border border-gold bg-gold/30 p-5 transition hover:bg-gold/50" data-enter><div class="mb-2 flex items-center justify-between"><span class="${eyebrow}">Friend requests</span>${icon('mail', 'w-4 h-4')}</div><p class="font-display text-xl">${pending.length} invitation${pending.length === 1 ? '' : 's'} waiting.</p><p class="mt-2 text-xs text-muted">Review and accept incoming invitations.</p></a>` : ''}<section class="rounded-2xl border border-line bg-transparent p-5" data-enter><span class="text-forest">${icon('lock')}</span><h3 class="mt-3 font-display text-lg">Sharing controls</h3><p class="mt-2 text-xs leading-6 text-muted">Your news stays with your friends. Choose your whole circle, or just a few familiar faces.</p></section></aside></div>`;
    renderFeed();
    document.getElementById('feedSearch').addEventListener('input', (event) => {
      query = event.target.value;
      renderFeed();
    });
  }
  function compose() {
    const me = Store.getCurrentUser(),
      friends = Store.getFriends(me.id);
    const el = UI.dialog(
      'Share an update',
      `<form id="composeForm"><p class="mb-5 text-sm leading-6 text-muted">Write your news and choose who can see it.</p><label for="postText" class="${label}">Your news</label><textarea id="postText" name="text" class="${input} min-h-36 resize-y" rows="5" maxlength="1200" required placeholder="Write an update…"></textarea><p id="charCount" class="mt-2 text-right text-[10px] text-muted">0 / 1200</p><fieldset class="mt-5"><legend class="${label}">Who’s this for?</legend><div class="grid gap-3 sm:grid-cols-2"><label class="flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-white p-3 text-sm"><input name="audience" type="radio" value="all" checked class="accent-forest">${icon('people', 'h-4 w-4')} All friends</label><label class="flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-white p-3 text-sm"><input name="audience" type="radio" value="selected" class="accent-forest">${icon('lock', 'h-4 w-4')} Choose friends</label></div><div id="friendPicker" class="mt-4 hidden rounded-xl border border-line bg-white p-4"><p class="mb-3 text-xs text-muted">Select at least one friend.</p>${friends.length ? friends.map((friend) => `<label class="flex cursor-pointer items-center gap-3 py-2 text-sm"><input type="checkbox" name="friend" value="${friend.id}" class="h-4 w-4 accent-forest">${avatar(friend, 28, 'rounded-lg')}${e(friend.name)}</label>`).join('') : '<p class="text-sm">Connect with someone first to share selectively.</p>'}</div></fieldset><p id="composeError" class="mt-4 hidden rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert"></p><div class="mt-6 flex justify-end gap-3"><button type="button" data-cancel class="${secondary}">Cancel</button><button type="submit" class="${primary}">Share update ${icon('arrow', 'w-4 h-4')}</button></div></form>`,
    );
    const form = el.querySelector('form');
    form.text.addEventListener('input', () => {
      el.querySelector('#charCount').textContent =
        `${form.text.value.length} / 1200`;
    });
    form.querySelectorAll('[name="audience"]').forEach((radio) =>
      radio.addEventListener('change', () => {
        el.querySelector('#friendPicker').classList.toggle(
          'hidden',
          form.audience.value === 'all',
        );
      }),
    );
    el.querySelector('[data-cancel]').addEventListener('click', UI.closeDialog);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        const audience =
          form.audience.value === 'all'
            ? 'all'
            : [...form.querySelectorAll('[name="friend"]:checked')].map(
                (checkbox) => checkbox.value,
              );
        Store.createPost(me.id, form.text.value, audience);
        filter = 'all';
        query = '';
        UI.closeDialog();
        render();
        UI.animate(document.getElementById('feed').firstElementChild);
        UI.toast('Update shared.');
      } catch (error) {
        const box = el.querySelector('#composeError');
        box.textContent = error.message;
        box.classList.remove('hidden');
      }
    });
  }
  main.addEventListener('click', (event) => {
    const composeBtn = event.target.closest('[data-compose]');
    if (composeBtn) {
      compose();
      return;
    }
    const filterBtn = event.target.closest('[data-filter]');
    if (filterBtn) {
      filter = filterBtn.dataset.filter;
      renderFeed();
      UI.enter(document.getElementById('feed'));
      return;
    }
    const rateBtn = event.target.closest('[data-rate]');
    if (rateBtn) {
      UI.rate(rateBtn.dataset.rate, render);
      return;
    }
    const reactBtn = event.target.closest('[data-react]');
    if (reactBtn)
      UI.run(() => {
        const postId = reactBtn.dataset.id,
          type = reactBtn.dataset.react;
        Store[type === 'like' ? 'toggleLike' : 'toggleDislike'](
          postId,
          Store.getCurrentUser().id,
        );
        renderFeed();
        const next = [...main.querySelectorAll('[data-react]')].find(
          (btn) => btn.dataset.id === postId && btn.dataset.react === type,
        );
        next?.focus({ preventScroll: true });
        UI.pulse(next);
      });
  });
  window.addEventListener('storage', (event) => {
    if (event.key === STORE_KEY) {
      Store.load();
      render();
    }
  });
  render();
  UI.enter(main);
})();
