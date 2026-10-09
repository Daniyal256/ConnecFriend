'use strict';
(() => {
  if (Store.getCurrentUser()) {
    location.replace('index.html');
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
  } = UI;
  document.getElementById('app').innerHTML =
    `<main class="min-h-screen lg:grid lg:grid-cols-2"><section class="relative flex flex-col overflow-hidden bg-ink px-6 py-8 text-paper sm:px-12 lg:px-14 lg:py-10">${UI.brand(true)}<div class="relative z-10 mt-14 lg:mt-20" data-enter><p class="${eyebrow} text-gold">ConnecFriend</p><h1 class="mt-5 font-display text-5xl leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">Keep up with<br>your friends.</h1><p class="mt-6 max-w-sm text-sm leading-7 text-paper/65">Share news with your friends, make new connections, and keep your conversations private.</p></div><figure class="mt-10 hidden sm:block" data-enter><img src="assets/desk.svg" alt="Illustrated desk with handwritten notes, a cup of tea, and fresh flowers" width="560" height="320" class="w-full rounded-2xl"></figure><p class="mt-auto pt-8 text-[10px] tracking-wide text-paper/45">ConnecFriend</p></section><section class="flex items-center justify-center px-6 py-12 sm:px-12"><div class="w-full max-w-md" data-enter><h2 class="font-display text-4xl tracking-tight sm:text-5xl">Welcome back</h2><p class="mt-3 text-sm text-muted">Sign in with your username and password.</p><form id="loginForm" class="mt-9 space-y-5"><div><label for="username" class="${label}">Username</label><input id="username" name="username" class="${input}" placeholder="Your username" autocomplete="username" autocapitalize="none" spellcheck="false" required maxlength="30"></div><div><label for="password" class="${label}">Password</label><div class="relative"><input id="password" name="password" type="password" class="${input} pr-20" placeholder="Enter your password" autocomplete="current-password" required maxlength="100"><button type="button" id="showPassword" aria-label="Show password" aria-pressed="false" class="absolute right-4 top-3.5 text-xs font-semibold text-forest">Show</button></div></div><label class="flex items-center gap-2 text-xs text-muted"><input type="checkbox" name="remember" class="h-4 w-4 rounded accent-forest">Keep me signed in</label><p id="loginError" class="hidden rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert"></p><button class="${primary} w-full py-3.5" type="submit">Sign in ${icon('arrow', 'w-4 h-4')}</button></form><div class="mt-8 rounded-2xl border border-line bg-white p-5"><p class="${eyebrow} text-muted">Accounts</p><div class="mt-4 grid grid-cols-3 gap-2">${Store.getUsers()
      .map(
        (user) =>
          `<button type="button" data-demo="${user.id}" class="flex items-center justify-center gap-2 rounded-xl border border-line px-2 py-2.5 text-xs font-medium transition hover:border-forest hover:bg-sage">${avatar(user, 24, 'rounded-lg')} ${e(user.username)}</button>`,
      )
      .join('')}</div></div></div></section></main>`;
  const form = document.getElementById('loginForm');
  document.querySelectorAll('[data-demo]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const user = Store.getUserById(btn.dataset.demo);
      form.username.value = user.username;
      form.password.value = 'pass123';
      document.getElementById('loginError').classList.add('hidden');
      form.querySelector('[type="submit"]').focus();
      UI.pulse(btn);
    }),
  );
  document.getElementById('showPassword').addEventListener('click', (event) => {
    const show = form.password.type === 'password';
    form.password.type = show ? 'text' : 'password';
    event.target.textContent = show ? 'Hide' : 'Show';
    event.target.setAttribute(
      'aria-label',
      show ? 'Hide password' : 'Show password',
    );
    event.target.setAttribute('aria-pressed', String(show));
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const error = document.getElementById('loginError');
    error.classList.add('hidden');
    try {
      const user = Store.login(
        form.username.value,
        form.password.value,
        form.remember.checked,
      );
      if (!user)
        throw new Error(
          'That username and password do not match. Please try again.',
        );
      location.href = 'index.html';
    } catch (err) {
      error.textContent = err.message;
      error.classList.remove('hidden');
      UI.animate(error);
    }
  });
  UI.enter();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    document.querySelectorAll('[data-float]').forEach((el, i) => {
      el.animate(
        [{ translate: '0 0' }, { translate: '0 -7px' }, { translate: '0 0' }],
        {
          duration: 4500 + i * 900,
          iterations: Infinity,
          easing: 'ease-in-out',
        },
      );
    });
})();
