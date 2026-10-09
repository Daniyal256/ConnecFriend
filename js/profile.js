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
    input,
    label,
    eyebrow,
    avatar,
    card,
  } = UI;
  const main = UI.shell('profile');
  const requested = new URLSearchParams(location.search).get('user');
  const userId = requested || Store.getCurrentUser().id;
  function render() {
    const me = Store.getCurrentUser(),
      user = Store.getUserById(userId);
    if (!user) {
      main.innerHTML = UI.empty(
        'Member not found',
        'This profile link does not belong to a member.',
        `<a class="${primary} mt-5" href="network.html">Browse members</a>`,
      );
      return;
    }
    const own = me.id === user.id,
      friends = Store.getFriendsSortedByLogin(user.id),
      ratings = Store.getRatingsReceived(user.id);
    main.innerHTML =
      UI.title(
        'Profile',
        own ? 'Your profile' : user.name,
        own
          ? 'Manage your personal information and view your friends.'
          : 'Personal information and friend list.',
        own
          ? `<button data-edit class="${secondary}">${icon('edit', 'w-4 h-4')} Edit profile</button>`
          : `<a href="messages.html?to=${user.id}" class="${primary}">${icon('mail', 'w-4 h-4')} Say hello</a>`,
      ) +
      `<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"><section class="${card} overflow-hidden" data-enter><div class="relative overflow-hidden bg-sage px-6 py-7 sm:px-8"><p class="${eyebrow} text-forest">Member portrait / @${e(user.username)}</p><div class="mt-6 flex flex-wrap items-center gap-5">${avatar(user, 104, 'border-4 border-white shadow-soft')}<div class="relative z-10"><h2 class="font-display text-3xl sm:text-4xl">${e(user.name)}</h2><p class="mt-2 max-w-sm text-sm text-forest">${e(user.tagline)}</p><p class="mt-3 flex items-center gap-1.5 text-xs text-muted">${icon('pin', 'w-3 h-3')}${e(user.location)}</p></div></div></div><div class="p-6 sm:p-8"><p class="${eyebrow} text-muted">About</p><p class="mt-4 whitespace-pre-wrap break-words font-display text-xl leading-8">${e(user.bio || 'A new story is waiting to be written.')}</p><div class="mt-7 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">${[
        ['Occupation', user.occupation, 'book'],
        ['Email', user.contact, 'mail'],
        ['Location', user.location, 'pin'],
        [
          'Member since',
          new Date(user.joined + 'T00:00:00').toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
          }),
          'clock',
        ],
      ]
        .map(
          ([heading, value, glyph]) =>
            `<div><p class="${eyebrow} text-muted">${heading}</p><p class="mt-2 flex items-center gap-2 break-all text-sm">${icon(glyph, 'w-4 h-4')} ${e(value || 'Not provided')}</p></div>`,
        )
        .join(
          '',
        )}</div></div></section><aside class="space-y-5"><div class="rounded-2xl bg-ink p-6 text-paper" data-enter><p class="${eyebrow} text-gold">Connections</p><p class="mt-5 font-display text-5xl">${friends.length}</p><p class="mt-2 text-sm text-paper/70">People in ${own ? 'your' : 'this'} circle</p><a href="network.html" class="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-gold">Explore the community ${icon('arrow', 'w-4 h-4')}</a></div><section class="${card} p-5" data-enter><h3 class="font-display text-xl">How friends see ${own ? 'you' : 'them'}</h3><p class="mt-2 text-[10px] text-muted">Ratings received from your circle.</p><div class="mt-5 space-y-3">${[1, 2, 3].map((value) => `<div class="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5"><span aria-hidden="true">${UI.ratingMark(value)}</span><span class="flex-1 text-xs font-medium">${Store.getRatingLabel(value)}</span><span class="text-xs font-semibold">${ratings[value]}</span></div>`).join('')}</div></section>${!own && Store.areFriends(me.id, user.id) ? `<button data-rate="${user.id}" class="${secondary} w-full">${UI.ratingMark(Store.getRating(me.id, user.id))} Rate your friendship</button>` : ''}</aside></div><section class="mt-9"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="${eyebrow} mb-2 text-forest">Friends</p><h2 class="font-display text-2xl">${own ? 'Your' : 'Their'} circle</h2></div><span class="text-[10px] text-muted">Sorted by latest login</span></div><div class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">${friends.length ? friends.map((friend) => `<article class="${card} flex flex-wrap items-center gap-3 p-5" data-enter><a href="profile.html?user=${friend.id}">${avatar(friend, 48)}</a><div class="flex-1"><a href="profile.html?user=${friend.id}" class="text-sm font-semibold hover:text-forest">${e(friend.name)}</a><p class="mt-1 text-[10px] text-muted">${Store.timeAgo(friend.lastLogin)}</p></div>${own ? `<button data-rate="${friend.id}" class="rounded-lg p-2 hover:bg-sage" aria-label="Rate ${e(friend.name)}">${UI.ratingMark(Store.getRating(me.id, friend.id))}</button><div class="flex w-full items-center justify-between border-t border-line pt-3"><a href="messages.html?to=${friend.id}" class="flex items-center gap-1.5 text-xs font-medium text-forest">${icon('mail', 'w-3.5 h-3.5')} Message</a><button data-remove="${friend.id}" class="text-[10px] text-muted hover:text-red-700">Remove connection</button></div>` : ''}</article>`).join('') : `<div class="sm:col-span-2">${UI.empty('A circle in the making', 'Invite someone from the community directory to connect.')}</div>`}</div></section>`;
  }
  function edit() {
    const user = Store.getCurrentUser();
    let picture = user.avatar;
    const fields = [
      ['name', 'Full name', 'text', 60],
      ['occupation', 'Occupation', 'text', 120],
      ['location', 'Location', 'text', 120],
      ['contact', 'Email', 'email', 120],
    ];
    const el = UI.dialog(
      'Edit profile',
      `<form id="profileForm"><div class="mb-5 flex flex-wrap items-center gap-4"><div id="picturePreview">${avatar(user, 68)}</div><div><label class="${label}" for="pictureFile">Profile picture</label><input id="pictureFile" type="file" accept="image/png,image/jpeg,image/webp" class="max-w-full text-xs"><p class="mt-2 text-[10px] text-muted">PNG, JPEG, or WebP · up to 500 KB</p></div></div><div class="grid gap-4 sm:grid-cols-2">${fields.map(([name, title, type, max]) => `<div><label for="edit-${name}" class="${label}">${title}</label><input id="edit-${name}" name="${name}" type="${type}" class="${input}" value="${e(user[name])}" maxlength="${max}" ${name === 'name' || name === 'contact' ? 'required' : ''}></div>`).join('')}</div><div class="mt-4"><label for="edit-tagline" class="${label}">Your headline</label><input id="edit-tagline" name="tagline" class="${input}" maxlength="120" value="${e(user.tagline)}"></div><div class="mt-4"><label for="edit-bio" class="${label}">A little about you</label><textarea id="edit-bio" name="bio" class="${input}" maxlength="500" rows="3">${e(user.bio)}</textarea></div><p id="editError" class="mt-4 hidden rounded-xl bg-red-50 p-3 text-xs text-red-700" role="alert"></p><div class="mt-6 flex justify-end gap-3"><button type="button" data-cancel class="${secondary}">Cancel</button><button type="submit" class="${primary}">Save changes ${icon('check', 'w-4 h-4')}</button></div></form>`,
    );
    const form = el.querySelector('form'),
      error = el.querySelector('#editError');
    const showError = (message) => {
      error.textContent = message;
      error.classList.remove('hidden');
    };
    let reading = false;
    el.querySelector('#pictureFile').addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (
        !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
        file.size > 500 * 1024
      ) {
        showError('Choose a PNG, JPEG, or WebP image smaller than 500 KB.');
        event.target.value = '';
        return;
      }
      reading = true;
      form.querySelector('[type="submit"]').disabled = true;
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          picture = reader.result;
          el.querySelector('#picturePreview img').src = picture;
          reading = false;
          form.querySelector('[type="submit"]').disabled = false;
          error.classList.add('hidden');
        };
        image.onerror = () => {
          reading = false;
          form.querySelector('[type="submit"]').disabled = false;
          showError(
            'That file is not a readable image. Choose another picture.',
          );
        };
        image.src = reader.result;
      };
      reader.onerror = () => {
        reading = false;
        form.querySelector('[type="submit"]').disabled = false;
        showError('Could not read the image. Try another file.');
      };
      reader.readAsDataURL(file);
    });
    el.querySelector('[data-cancel]').addEventListener('click', UI.closeDialog);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (reading) return;
      try {
        const data = Object.fromEntries(new FormData(form));
        data.avatar = picture;
        Store.updateUser(user.id, data);
        UI.closeDialog();
        location.reload();
      } catch (err) {
        showError(err.message);
      }
    });
  }
  main.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    if (btn.hasAttribute('data-edit')) edit();
    if (btn.dataset.rate) UI.rate(btn.dataset.rate, render);
    if (btn.dataset.remove) {
      const friend = Store.getUserById(btn.dataset.remove);
      const el = UI.dialog(
        'Remove this connection?',
        `<p class="text-sm leading-6 text-muted">${e(friend.name)} will leave your circle. You can invite them again later.</p><div class="mt-6 flex justify-end gap-3"><button data-cancel class="${secondary}">Keep connection</button><button data-confirm class="${primary}">Remove connection</button></div>`,
      );
      el.querySelector('[data-cancel]').addEventListener(
        'click',
        UI.closeDialog,
      );
      el.querySelector('[data-confirm]').addEventListener('click', () =>
        UI.run(() => {
          Store.removeFriend(Store.getCurrentUser().id, friend.id);
          UI.closeDialog();
          render();
          UI.toast('Connection removed.');
        }),
      );
    }
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
