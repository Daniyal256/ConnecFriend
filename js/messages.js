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
    eyebrow,
    avatar,
    card,
  } = UI;
  const main = UI.shell('messages'),
    me = Store.getCurrentUser();
  const requested = new URLSearchParams(location.search).get('to');
  let selected =
    requested && requested !== me.id && Store.getUserById(requested)
      ? requested
      : null;
  let query = '';
  const drafts = {};
  if (!selected) selected = Store.getConversationPartners(me.id)[0]?.id || null;
  main.innerHTML =
    UI.title(
      'Inbox',
      'Private messages',
      'Send a private message to friends or other members.',
      `<button data-new-message class="${primary}">${icon('plus', 'w-4 h-4')} New conversation</button>`,
    ) +
    `<div class="${card} grid overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]" data-enter><aside class="border-b border-line bg-white lg:border-b-0 lg:border-r"><div class="p-5"><p class="${eyebrow} mb-4 text-muted">Conversations</p><label class="relative block"><span class="sr-only">Find a conversation</span><span class="absolute left-3 top-3 text-muted">${icon('search', 'w-4 h-4')}</span><input id="conversationSearch" type="search" class="${input} bg-paper py-2.5 pl-10" placeholder="Find a conversation…"></label></div><div id="partners" class="max-h-64 overflow-y-auto px-3 pb-4 lg:max-h-[500px]"></div><div class="hidden border-t border-line p-5 lg:block"><p class="flex items-center gap-2 text-[10px] leading-5 text-muted">${icon('lock', 'w-4 h-4')} Private between you and the recipient.</p></div></aside><section id="conversation" class="flex min-w-0 flex-col"></section></div>`;
  function renderPartners() {
    let people = Store.getConversationPartners(me.id);
    if (selected && !people.some((user) => user.id === selected))
      people.unshift(Store.getUserById(selected));
    people = people.filter((user) =>
      `${user.name} ${user.username}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
    document.getElementById('partners').innerHTML = people.length
      ? people
          .map((user) => {
            const last = Store.getConversation(me.id, user.id).at(-1);
            return `<button data-partner="${user.id}" class="mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selected === user.id ? 'bg-sage' : 'hover:bg-paper'}" ${selected === user.id ? 'aria-current="true"' : ''}>${avatar(user, 40, 'rounded-xl')}<span class="min-w-0 flex-1"><span class="flex items-center justify-between gap-2"><span class="truncate text-xs font-semibold">${e(user.name)}</span><span class="shrink-0 text-[9px] text-muted">${last ? Store.timeAgo(last.timestamp) : 'New'}</span></span><span class="mt-1 block truncate text-[10px] text-muted">${last ? e((last.fromId === me.id ? 'You: ' : '') + last.text) : 'Start with a hello.'}</span></span></button>`;
          })
          .join('')
      : '<p class="p-5 text-xs leading-6 text-muted">No conversations found. Start a new one with any member.</p>';
  }
  function renderConversation(scroll = false) {
    const target = document.getElementById('conversation'),
      user = Store.getUserById(selected);
    const wasFocused = document.activeElement?.id === 'messageText';
    if (!user) {
      target.innerHTML = `<div class="grid min-h-96 place-items-center p-8">${UI.empty('Every conversation starts somewhere', 'Choose a conversation or say hello to someone new.', `<button data-new-message class="${primary} mt-5">Start a conversation</button>`)}</div>`;
      return;
    }
    const messages = Store.getConversation(me.id, user.id);
    let previousDay = '';
    target.innerHTML = `<header class="flex items-center justify-between gap-3 border-b border-line bg-paper/50 px-5 py-4"><div class="flex items-center gap-3">${avatar(user, 40, 'rounded-xl')}<div><a href="profile.html?user=${user.id}" class="text-sm font-semibold hover:text-forest">${e(user.name)}</a><p class="mt-1 text-[10px] text-muted">${Store.areFriends(me.id, user.id) ? 'In your circle' : 'Community member · outside your circle'}</p></div></div><span class="text-forest" title="Private correspondence">${icon('lock', 'w-4 h-4')}</span></header><div id="transcript" role="log" aria-label="Conversation with ${e(user.name)}" aria-live="polite" class="h-[420px] overflow-y-auto overscroll-contain bg-paper/40 p-5 sm:p-6">${
      messages.length
        ? messages
            .map((message) => {
              const mine = message.fromId === me.id,
                author = mine ? me : user;
              const day = new Date(message.timestamp).toLocaleDateString(
                'en-GB',
                { day: 'numeric', month: 'long', year: 'numeric' },
              );
              const divider =
                day !== previousDay
                  ? `<div class="mb-5 mt-2 flex items-center gap-3 text-[9px] uppercase tracking-widest text-muted"><span class="h-px flex-1 bg-line"></span>${e(day)}<span class="h-px flex-1 bg-line"></span></div>`
                  : '';
              previousDay = day;
              return `${divider}<article class="mb-5 flex gap-3">${avatar(author, 30, 'rounded-lg')}<div class="min-w-0 flex-1"><div class="mb-1.5 flex items-center justify-between gap-2"><span class="text-[10px] font-semibold">${mine ? 'You' : e(author.name.split(' ')[0])}</span><time class="text-[9px] text-muted" datetime="${e(message.timestamp)}">${Store.formatTime(message.timestamp)}</time></div><p class="whitespace-pre-wrap break-words rounded-xl border border-line px-4 py-3 text-sm leading-6 ${mine ? 'bg-sage/60' : 'bg-white'}">${e(message.text)}</p></div></article>`;
            })
            .join('')
        : UI.empty(
            'Start a conversation',
            `Send ${user.name.split(' ')[0]} a private message to start the conversation.`,
          )
    }</div><form id="messageForm" class="border-t border-line bg-white p-4"><label for="messageText" class="sr-only">Your private message</label><div class="flex items-end gap-3"><textarea id="messageText" name="message" rows="2" maxlength="2000" required class="${input} min-w-0 flex-1 resize-none bg-paper" placeholder="Write a message…">${e(drafts[selected] || '')}</textarea><button type="submit" class="${primary} shrink-0 px-3 sm:px-4" aria-label="Send private message">${icon('send', 'w-4 h-4')}<span class="hidden sm:inline">Send</span></button></div><div class="mt-2 flex justify-between gap-3 text-[9px] text-muted"><span>Enter to send · Shift + Enter for a new line</span><span id="messageCount">${(drafts[selected] || '').length} / 2000</span></div></form>`;
    const form = target.querySelector('form'),
      textarea = form.elements.message;
    textarea.addEventListener('input', () => {
      drafts[selected] = textarea.value;
      target.querySelector('#messageCount').textContent =
        `${textarea.value.length} / 2000`;
    });
    textarea.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      UI.run(() => {
        Store.sendMessage(me.id, selected, textarea.value);
        drafts[selected] = '';
        renderPartners();
        renderConversation(true);
        document.getElementById('messageText').focus();
        UI.animate(document.getElementById('transcript').lastElementChild);
      });
    });
    if (scroll || wasFocused) {
      const log = document.getElementById('transcript');
      log.scrollTop = log.scrollHeight;
    }
    if (wasFocused)
      document.getElementById('messageText').focus({ preventScroll: true });
  }
  function newConversation() {
    const users = Store.getUsers().filter((user) => user.id !== me.id);
    const el = UI.dialog(
      'New conversation',
      `<p class="mb-4 text-sm text-muted">Choose any member. You don’t have to be friends to talk.</p><label class="sr-only" for="newConversationSearch">Search members</label><input id="newConversationSearch" type="search" class="${input} mb-4" placeholder="Find a name or interest…"><div id="newPartners" class="space-y-2">${users.map((user) => `<button data-new-partner="${user.id}" class="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-3 text-left transition hover:bg-sage">${avatar(user, 40)}<span class="flex-1"><span class="block text-sm font-semibold">${e(user.name)}</span><span class="text-[10px] text-muted">${e(user.occupation)} · ${Store.areFriends(me.id, user.id) ? 'Friend' : 'Member'}</span></span>${icon('arrow', 'w-4 h-4')}</button>`).join('')}</div><p id="noNewPartners" class="hidden py-4 text-xs text-muted">No members match this search.</p>`,
    );
    el.querySelector('#newConversationSearch').addEventListener(
      'input',
      (event) => {
        const text = event.target.value.toLowerCase();
        let count = 0;
        el.querySelectorAll('[data-new-partner]').forEach((btn) => {
          const matches = btn.textContent.toLowerCase().includes(text);
          btn.classList.toggle('hidden', !matches);
          if (matches) count++;
        });
        el.querySelector('#noNewPartners').classList.toggle(
          'hidden',
          count !== 0,
        );
      },
    );
    el.querySelectorAll('[data-new-partner]').forEach((btn) =>
      btn.addEventListener('click', () => {
        selected = btn.dataset.newPartner;
        history.replaceState(null, '', `messages.html?to=${selected}`);
        UI.closeDialog();
        renderPartners();
        renderConversation(true);
        document.getElementById('messageText').focus();
      }),
    );
  }
  main.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    if (btn.hasAttribute('data-new-message')) newConversation();
    if (btn.dataset.partner) {
      selected = btn.dataset.partner;
      history.replaceState(null, '', `messages.html?to=${selected}`);
      renderPartners();
      renderConversation(true);
      UI.animate(document.getElementById('conversation'));
    }
  });
  document
    .getElementById('conversationSearch')
    .addEventListener('input', (event) => {
      query = event.target.value;
      renderPartners();
    });
  window.addEventListener('storage', (event) => {
    if (event.key === STORE_KEY) {
      Store.load();
      renderPartners();
      renderConversation(true);
    }
  });
  renderPartners();
  renderConversation(true);
  UI.enter(main);
  if (requested && (requested === me.id || !Store.getUserById(requested)))
    UI.toast('Choose another valid member to start a conversation.', true);
})();
