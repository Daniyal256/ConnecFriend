# ConnecFriend

A browser-only social networking assignment with an original editorial workspace UI. Built with HTML, vanilla JavaScript, and Tailwind CSS 3.4.17 compiled into a local stylesheet. No handwritten CSS, `<style>` blocks, inline CSS, backend, API requests, or registration page.

## Run

Open `login.html` in a modern browser. The generated `css/tailwind.css` file is included, so viewing the UI requires no internet access or Node.js. For consistent browser storage across pages, use your editor's Live Server extension or run `python3 -m http.server 8080` and open http://localhost:8080/login.html. This is static file serving only: social actions do not make server requests.

All accounts use password **pass123**:

| Username | Member |
| --- | --- |
| zain | Zain |
| wasif | Wasif |
| saad | Saad |
| daniyal | Daniyal |
| abdullah | Abdullah |
| farrukh | Farrukh Shah |

Click a demo account to fill the form, then sign in. Sign out using the icon beside your account to switch users. Login credentials are intentionally visible demo data, not real authentication.

## Assignment features

- Login validates existing credentials, reports errors, records the last login, and optionally remembers the account. Protected pages redirect signed-out visitors.
- The home board contains your own updates and news shared by your friends. Every update shows the author's name, profile picture, time since last login, sharing scope, and reaction counts.
- The home circle and profile friend list sort members by latest login first.
- Profiles show personal information, a profile picture, biography, and all friends. The signed-in user can edit their profile and upload a PNG/JPEG/WebP picture under 500 KB.
- Connections includes the member directory, incoming invitations, sent invitations, and an ignore list. Accept, decline, or cancel invitations. The recipient's ignore list prevents an invitation from being sent.
- Rate friends with the required icon scale: 1 = Stupid (🙃), 2 = Cool (😎), 3 = Trustworthy (🛡️).
- Share news with all friends or a chosen non-empty subset of current friends. All-friends updates are not public to non-friends.
- Like or dislike an update with visible counts. Reactions toggle, cannot be duplicated, and are mutually exclusive per member.
- Send and receive private messages with friends and non-friends. Select any member under New conversation. Actual replies are made by signing into the recipient's account; no fake automatic replies.
- Tailwind utility classes provide responsive styling, hover transitions, and focus states. The Web Animations API supplies entrances, reaction feedback, and dialog motion. Reduced-motion preferences are respected.
- User-entered text is HTML escaped. Required fields, size limits, audience membership, permissions, invalid profile links, duplicate invitations, corrupt saved data, and storage failures are handled.

## Quick verification

1. Sign in as Zain. Wasif, Saad, then Daniyal appear in the initial activity order. Abdullah's incoming invitation is already waiting.
2. Accept Abdullah's invitation in Connections. He joins both users' friend lists.
3. Try inviting Farrukh as Zain: the invitation is blocked because Farrukh ignores Zain. To test a successful fresh invitation, sign in as Wasif and invite Abdullah; sign in as Abdullah to accept.
4. As Zain, share an update only with Wasif. Wasif can see it; Saad cannot. An all-friends update is visible to Zain's friends, and not to non-friends.
5. Change a post from like to dislike: the like count drops and the dislike count rises. Click again to clear the reaction.
6. Send Farrukh a private message as Zain, even though he is not Zain's friend. Sign in as Farrukh to read it and reply.
7. Rate a friend, edit your profile, and reload: changes persist in the same browser.

Browser storage is a shared simulation database on the same origin; different browsers/devices do not share data. Session logins are per tab unless Remember me is selected. The new version uses `connecfriend_v3` and does not overwrite older demo data.

## Submission

Create a ZIP named with your roll number containing all five HTML pages and the `js`, `assets`, and `css` folders. Include `css/tailwind.css`: it is the generated framework stylesheet. Exclude `node_modules` and `tests`.

## Source structure

`js/store.js` is the validated state layer. `js/ui.js` holds shared components and accessibility/motion helpers. Each page has its own controller. `tailwind.config.js` contains Tailwind theme tokens, content paths, and avatar size classes. The illustrated portraits and botanical/mountain artwork are SVG artwork and supplied profile photographs.

## Rebuild styling

After changing utility classes or theme tokens, run `npm run build:css`. Use `npm run watch:css` during development for automatic rebuilds. `node_modules` is needed only to build the CSS; the generated file runs independently. If packages are missing, restore them with `npm ci` (internet is required only for dependency installation). `css/input.css` contains only Tailwind directives, with no custom CSS rules.
