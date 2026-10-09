'use strict';
const UI = (() => {
  const escape = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (char) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[char],
    );
  const paths = {
    board:
      '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h7m-7 4h7m-7 3h4"/>',
    people:
      '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-16a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4v2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 6 9 7 9-7"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    logout: '<path d="M9 4H4v16h5m5-13 5 5-5 5m-6-5h11"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    like: '<path d="M7 10v11H3V10h4Zm0 0 4-7c2-1 3 1 2 5h6a2 2 0 0 1 2 2l-2 9a2 2 0 0 1-2 2H7"/>',
    dislike:
      '<path d="M7 14V3H3v11h4Zm0 0 4 7c2 1 3-1 2-5h6a2 2 0 0 0 2-2l-2-9a2 2 0 0 0-2-2H7"/>',
    pin: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    edit: '<path d="m16 3 5 5L9 20l-6 1 1-6L16 3Zm-3 3 5 5"/>',
    spark:
      '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
    shield:
      '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    send: '<path d="m21 3-7 18-4-7-7-4 18-7Zm0 0L10 14"/>',
    book: '<path d="M12 6v15m0-15C8 2 3 4 3 4v15s5-2 9 2m0-15c4-4 9-2 9-2v15s-5-2-9 2"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/>',
  };
  const icon = (name, classes = 'w-5 h-5') =>
    `<svg class="${classes} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
  const button =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none';
  const primary =
    button +
    ' bg-ink text-white hover:bg-forest motion-safe:hover:-translate-y-0.5';
  const secondary =
    button + ' border border-line bg-white text-ink hover:bg-sage';
  const input =
    'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition';
  const label = 'mb-2 block text-xs font-semibold text-ink';
  const card = 'rounded-2xl border border-line bg-white shadow-soft';
  const eyebrow = 'text-[10px] font-bold uppercase tracking-[0.2em]';
  function avatar(user, size = 44, extra = '') {
    const allowed =
      /^assets\/avatars\/(?:u[1-6]\.svg|(?:zain|wasif|saad|daniyal|abdullah)\.jpeg)$|^data:image\/(png|jpeg|webp);base64,/;
    const src = allowed.test(user.avatar || '')
      ? user.avatar
      : 'assets/avatars/u1.svg';
    return `<img src="${escape(src)}" width="${size}" height="${size}" alt="${escape(user.name)}'s profile picture" class="shrink-0 rounded-2xl object-cover w-[${size}px] h-[${size}px] ${extra}" loading="lazy">`;
  }
  function brand(dark = false) {
    return `<a href="index.html" class="inline-flex items-center gap-2.5 font-semibold tracking-tight ${dark ? 'text-paper' : 'text-ink'}"><span class="grid h-9 w-9 place-items-center rounded-xl bg-gold text-ink">${icon('people')}</span><span>Connec<span class="${dark ? 'text-gold' : 'text-forest'}">Friend</span></span></a>`;
  }
  function ratingMark(value) {
    return { 1: '🙃', 2: '😎', 3: '🛡️' }[value] || '✦';
  }
  function empty(title, message, action = '') {
    return `<div class="rounded-2xl border border-dashed border-line p-8 text-center"><span class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-sage text-forest">${icon('spark')}</span><h3 class="text-base font-semibold">${escape(title)}</h3><p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">${escape(message)}</p>${action}</div>`;
  }
  function toast(message, error = false) {
    let region = document.getElementById('notices');
    if (!region) {
      region = document.createElement('div');
      region.id = 'notices';
      region.className =
        'fixed bottom-5 left-4 right-4 z-50 flex flex-col items-center gap-2 pointer-events-none';
      region.setAttribute('aria-live', 'polite');
      document.body.append(region);
    }
    const notice = document.createElement('div');
    notice.className = `flex max-w-lg items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl text-sm pointer-events-auto ${error ? 'bg-red-50 border-red-200 text-red-800' : 'bg-ink border-forest text-white'}`;
    notice.setAttribute('role', error ? 'alert' : 'status');
    notice.innerHTML = icon(error ? 'ban' : 'check') + '<span></span>';
    notice.querySelector('span').textContent = message;
    region.append(notice);
    animate(notice);
    setTimeout(() => notice.remove(), error ? 7000 : 4500);
  }
  const reduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate(element, delay = 0) {
    if (!element || reduced() || !element.animate) return;
    element.animate(
      [
        { transform: 'translateY(6px)' },
        { transform: 'translateY(0)' },
      ],
      {
        duration: 220,
        delay,
        easing: 'cubic-bezier(.2,.7,.3,1)',
        fill: 'backwards',
      },
    );
  }
  function enter(parent = document) {
    parent
      .querySelectorAll('[data-enter]')
      .forEach((element, index) => animate(element, Math.min(index * 45, 240)));
  }
  function pulse(element) {
    if (element && !reduced() && element.animate)
      element.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.13)' },
          { transform: 'scale(1)' },
        ],
        { duration: 250 },
      );
  }
  let dialogElement;
  function closeDialog() {
    dialogElement?.close();
  }
  function dialog(title, body) {
    dialogElement?.remove();
    dialogElement = document.createElement('dialog');
    dialogElement.className =
      'm-auto w-[calc(100%-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto rounded-3xl border border-line bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm';
    dialogElement.setAttribute('aria-labelledby', 'dialogTitle');
    dialogElement.innerHTML = `<div class="flex items-center justify-between gap-3 border-b border-line px-6 py-5"><h2 id="dialogTitle" class="font-display text-2xl">${escape(title)}</h2><button type="button" class="${button} px-2 hover:bg-sage" aria-label="Close dialog" data-close>${icon('close')}</button></div><div class="p-6">${body}</div>`;
    document.body.append(dialogElement);
    dialogElement
      .querySelector('[data-close]')
      .addEventListener('click', closeDialog);
    dialogElement.addEventListener('click', (event) => {
      if (event.target === dialogElement) {
        const rect = dialogElement.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          closeDialog();
      }
    });
    dialogElement.showModal();
    animate(dialogElement);
    return dialogElement;
  }
  function rate(userId, refresh) {
    const me = Store.getCurrentUser(),
      user = Store.getUserById(userId);
    const current = Store.getRating(me.id, userId);
    const body = `<div class="mb-5 flex items-center gap-3">${avatar(user, 52)}<div><p class="font-semibold">${escape(user.name)}</p><p class="text-xs text-muted">A personal rating, just for you.</p></div></div><div class="space-y-3">${[1, 2, 3].map((value) => `<button type="button" data-rate="${value}" aria-pressed="${value === current}" class="${secondary} w-full justify-start p-4 ${value === current ? 'border-forest bg-sage' : ''}"><span class="text-2xl" aria-hidden="true">${ratingMark(value)}</span><span class="flex-1 text-left">${Store.getRatingLabel(value)}</span><span class="text-xs text-muted">${value} / 3</span>${value === current ? icon('check') : ''}</button>`).join('')}</div>${current ? `<button class="mt-4 text-xs text-muted underline" data-clear-rating>Clear rating</button>` : ''}`;
    const el = dialog('Rate your friend', body);
    el.querySelectorAll('[data-rate]').forEach((btn) =>
      btn.addEventListener('click', () =>
        run(() => {
          Store.setRating(me.id, userId, Number(btn.dataset.rate));
          closeDialog();
          refresh();
          toast('Friend rating updated.');
        }),
      ),
    );
    el.querySelector('[data-clear-rating]')?.addEventListener('click', () =>
      run(() => {
        Store.setRating(me.id, userId, null);
        closeDialog();
        refresh();
        toast('Rating cleared.');
      }),
    );
  }
  function run(action) {
    try {
      return action();
    } catch (error) {
      toast(error.message || 'Something went wrong. Please try again.', true);
      return null;
    }
  }
  function shell(page) {
    const me = Store.getCurrentUser();
    const nav = [
      ['home', 'index.html', 'board', 'News board'],
      ['network', 'network.html', 'people', 'Your connections'],
      ['messages', 'messages.html', 'mail', 'Private messages'],
      ['profile', 'profile.html', 'user', 'Your profile'],
    ];
    const count = Store.getPendingRequests(me.id).length;
    const navMarkup = (mobile) =>
      nav
        .map(
          ([key, href, glyph, title]) =>
            `<a href="${href}" ${key === page ? 'aria-current="page"' : ''} class="${mobile ? 'flex flex-col items-center gap-1 px-3 py-2 text-[10px]' : 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm'} transition ${key === page ? (mobile ? 'text-forest font-bold' : 'bg-gold text-ink font-semibold') : mobile ? 'text-muted hover:text-forest' : 'text-paper/70 hover:bg-white/10 hover:text-white'}">${icon(glyph)}<span>${mobile ? { home: 'Board', network: 'Connections', messages: 'Messages', profile: 'Profile' }[key] : title}</span>${!mobile && key === 'network' && count ? `<span class="ml-auto rounded-full bg-white/70 px-1.5 text-[10px] text-ink">${count}</span>` : ''}</a>`,
        )
        .join('');
    document.getElementById('app').innerHTML =
      `<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-gold focus:p-3">Skip to content</a><div class="min-h-screen lg:grid lg:grid-cols-[224px_minmax(0,1fr)]"><aside class="hidden h-screen flex-col sticky top-0 bg-ink p-6 lg:flex">${brand(true)}<div class="mt-12 mb-4 ${eyebrow} text-paper/40">Your workspace</div><nav class="space-y-2" aria-label="Main navigation">${navMarkup(false)}</nav><div class="mt-auto"><div class="mt-5 flex items-center gap-3">${avatar(me, 36)}<div class="flex-1 overflow-hidden"><p class="truncate text-xs font-semibold text-white">${escape(me.name)}</p><p class="text-[10px] text-paper/50">@${escape(me.username)}</p></div><button class="text-paper/70 hover:text-gold" data-logout aria-label="Sign out">${icon('logout', 'w-4 h-4')}</button></div></div></aside><div class="min-w-0"><header class="border-b border-line bg-paper px-5 py-4 sm:px-8 lg:px-10"><div class="flex items-center justify-between gap-4"><div class="lg:hidden">${brand()}</div><p class="hidden text-xs text-muted lg:block"><span class="text-ink font-medium">Your space</span><span class="mx-3">/</span>${{ home: 'News board', network: 'Connections', messages: 'Messages', profile: 'Profile' }[page]}</p><div class="flex items-center gap-3"><span class="hidden sm:inline text-[10px] uppercase tracking-widest text-muted">${escape(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))}</span><button data-logout class="text-muted hover:text-ink lg:hidden" aria-label="Sign out">${icon('logout', 'w-4 h-4')}</button></div></div><nav class="mt-4 flex justify-around border-t border-line pt-3 lg:hidden" aria-label="Mobile navigation">${navMarkup(true)}</nav></header><main id="main" class="mx-auto max-w-[1500px] p-5 sm:p-8 lg:p-10" tabindex="-1"></main><footer class="mx-5 flex flex-wrap items-center justify-between gap-2 border-t border-line py-5 text-[10px] text-muted sm:mx-8 lg:mx-10"><span>ConnecFriend</span></footer></div></div>`;
    document.querySelectorAll('[data-logout]').forEach((btn) =>
      btn.addEventListener('click', () => {
        Store.logout();
        location.href = 'login.html';
      }),
    );
    return document.getElementById('main');
  }
  function title(eyebrowText, heading, description, action = '') {
    return `<div class="mb-8 flex flex-wrap items-end justify-between gap-4" data-enter><div><p class="${eyebrow} mb-3 text-forest">${escape(eyebrowText)}</p><h1 class="font-display text-4xl tracking-tight sm:text-5xl">${escape(heading)}</h1><p class="mt-3 max-w-xl text-sm leading-relaxed text-muted">${escape(description)}</p></div>${action}</div>`;
  }
  return {
    escape,
    icon,
    button,
    primary,
    secondary,
    input,
    label,
    card,
    eyebrow,
    avatar,
    brand,
    ratingMark,
    empty,
    toast,
    animate,
    enter,
    pulse,
    dialog,
    closeDialog,
    rate,
    run,
    shell,
    title,
  };
})();
