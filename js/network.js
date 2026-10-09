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
    eyebrow,
    avatar,
    card,
  } = UI;
  const main = UI.shell('network');
  let query = '',
    filter = 'all';
  function memberCard(user) {
    const me = Store.getCurrentUser(),
      friend = Store.areFriends(me.id, user.id),
      ignored = Store.isIgnored(me.id, user.id),
      sent = Store.hasRequest(me.id, user.id),
      incoming = Store.hasRequest(user.id, me.id);
    let action = friend
      ? `<button data-rate="${user.id}" class="${secondary} flex-1">${UI.ratingMark(Store.getRating(me.id, user.id))} Rate friend</button>`
      : ignored
        ? `<button data-ignore="${user.id}" class="${secondary} flex-1">Remove from ignore</button>`
        : incoming
          ? `<button data-accept="${user.id}" class="${primary} flex-1">Accept invitation</button>`
          : sent
            ? `<button data-cancel="${user.id}" class="${secondary} flex-1">${icon('clock', 'h-4 w-4')} Pending · cancel</button>`
            : `<button data-invite="${user.id}" class="${primary} flex-1">${icon('plus', 'h-4 w-4')} Invite to circle</button>`;
    const tint = {
      u1: 'bg-sage',
      u2: 'bg-peach',
      u3: 'bg-lilac',
      u4: 'bg-gold/35',
      u5: 'bg-lilac',
      u6: 'bg-sage',
    }[user.id];
    return `<article class="${card} overflow-hidden transition duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1" data-enter><div class="relative flex items-center justify-between ${tint} px-5 py-4"><a href="profile.html?user=${user.id}">${avatar(user, 60)}</a><span class="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-medium">${ignored ? 'Ignored' : friend ? 'In your circle' : sent ? 'Invitation sent' : 'Community member'}</span></div><div class="p-5"><a href="profile.html?user=${user.id}" class="font-display text-2xl hover:text-forest">${e(user.name)}</a><p class="mt-1 text-xs text-forest">${e(user.occupation)}</p><p class="mt-4 min-h-16 text-xs leading-6 text-muted line-clamp-3">${e(user.bio)}</p><p class="mt-4 flex items-center gap-1.5 text-[10px] text-muted">${icon('pin', 'h-3 w-3')}${e(user.location)}</p><div class="mt-5 flex flex-wrap gap-2">${action}<a href="messages.html?to=${user.id}" class="${secondary} px-3" aria-label="Message ${e(user.name)}">${icon('mail', 'h-4 w-4')}</a></div>${!ignored ? `<button data-ignore="${user.id}" class="mt-4 text-[10px] text-muted underline decoration-line underline-offset-4 hover:text-ink">Ignore invitations from this member</button>` : '<p class="mt-4 text-[10px] text-muted">New invitations from this member are blocked.</p>'}</div></article>`;
  }
  function renderMembers() {
    const me = Store.getCurrentUser();
    const members = Store.getUsers().filter(
      (user) =>
        user.id !== me.id &&
        `${user.name} ${user.username} ${user.occupation} ${user.location}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (filter === 'all' ||
          (filter === 'friends' && Store.areFriends(me.id, user.id)) ||
          (filter === 'ignored' && Store.isIgnored(me.id, user.id))),
    );
    document.getElementById('members').innerHTML = members.length
      ? members.map(memberCard).join('')
      : `<div class="sm:col-span-2 2xl:col-span-3">${UI.empty('No members here', query ? 'Try a different name, interest, or location.' : filter === 'ignored' ? 'Your ignore list is clear.' : 'Invite someone to start growing your circle.')}</div>`;
    document.getElementById('memberCount').textContent =
      `${members.length} member${members.length === 1 ? '' : 's'}`;
    document.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.className = `rounded-full px-4 py-2.5 text-xs font-semibold transition ${btn.dataset.filter === filter ? 'bg-ink text-white' : 'text-muted hover:bg-white'}`;
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
    });
  }
  function render() {
    const me = Store.getCurrentUser(),
      pending = Store.getPendingRequests(me.id);
    main.innerHTML =
      UI.title(
        'Member directory',
        'Your connections',
        'Find members, manage invitations, and update your ignore list.',
      ) +
      `<section id="invitations" class="mb-7 rounded-2xl border border-line bg-sage/50 p-5 scroll-mt-5" data-enter><div class="mb-4 flex items-center justify-between"><h2 class="font-display text-xl">Friend requests</h2><span class="rounded-full bg-white px-2.5 py-1 text-[10px]">${pending.length} pending</span></div>${pending.length ? `<div class="grid gap-4 lg:grid-cols-2">${pending.map((user) => `<div class="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4">${avatar(user, 42)}<div class="flex-1"><a href="profile.html?user=${user.id}" class="text-sm font-semibold">${e(user.name)}</a><p class="mt-1 text-[10px] text-muted">${e(user.occupation)}</p></div><button data-accept="${user.id}" class="${primary} px-3 py-2 text-xs">Accept</button><button data-decline="${user.id}" class="${secondary} px-3 py-2 text-xs">Decline</button></div>`).join('')}</div>` : '<p class="text-xs text-muted">All caught up. New friend invitations will appear here.</p>'}</section><div class="mb-5 flex flex-wrap items-center justify-between gap-3"><div class="flex flex-wrap gap-1" aria-label="Filter members">${[
        ['all', 'Everyone'],
        ['friends', 'Your friends'],
        ['ignored', 'Ignore list'],
      ]
        .map(
          ([key, title]) =>
            `<button data-filter="${key}" aria-pressed="false">${title}</button>`,
        )
        .join(
          '',
        )}</div><label class="relative w-full sm:w-72"><span class="sr-only">Search members</span><span class="absolute left-3 top-3.5 text-muted">${icon('search', 'w-4 h-4')}</span><input id="memberSearch" type="search" class="${input} pl-10" placeholder="Name, interest, or city…" value="${e(query)}"></label></div><div class="mb-4 flex justify-between text-[10px] text-muted"><span class="uppercase tracking-widest">The community directory</span><span id="memberCount"></span></div><div id="members" class="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3"></div><p class="mt-6 flex items-start gap-2 text-xs leading-6 text-muted">${icon('shield', 'w-4 h-4')} Your ignore list blocks incoming invitations. Private conversations are available with any member, including people outside your circle.</p>`;
    renderMembers();
    document
      .getElementById('memberSearch')
      .addEventListener('input', (event) => {
        query = event.target.value;
        renderMembers();
      });
  }
  main.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    const me = Store.getCurrentUser();
    if (btn.dataset.filter) {
      filter = btn.dataset.filter;
      renderMembers();
      UI.enter(document.getElementById('members'));
      return;
    }
    if (btn.dataset.rate) {
      UI.rate(btn.dataset.rate, render);
      return;
    }
    UI.run(() => {
      if (btn.dataset.invite) {
        const result = Store.sendFriendRequest(me.id, btn.dataset.invite);
        if (!result.success) {
          const messages = {
            ignored:
              'Invitation blocked: this member has added you to their ignore list.',
            you_ignored:
              'Remove this member from your ignore list before inviting them.',
            already_friends: 'You are already friends.',
            already_sent: 'An invitation is already pending.',
            incoming:
              'This member has already invited you. Accept their invitation above.',
          };
          UI.toast(messages[result.reason], true);
          return;
        }
        UI.toast('Invitation sent.');
      } else if (btn.dataset.accept) {
        Store.acceptFriendRequest(btn.dataset.accept, me.id);
        UI.toast('Friend request accepted.');
      } else if (btn.dataset.decline) {
        Store.declineFriendRequest(btn.dataset.decline, me.id);
        UI.toast('Invitation declined.');
      } else if (btn.dataset.cancel) {
        Store.cancelFriendRequest(me.id, btn.dataset.cancel);
        UI.toast('Invitation cancelled.');
      } else if (btn.dataset.ignore) {
        const ignored = Store.toggleIgnore(me.id, btn.dataset.ignore);
        UI.toast(
          ignored
            ? 'Member added to your ignore list.'
            : 'Member removed from your ignore list.',
        );
      } else return;
      render();
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
