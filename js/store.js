/** Browser-only simulation. No API calls; all social actions persist in this browser. */
'use strict';
const STORE_KEY = 'connecfriend_v3';
const SEED = {
  users: [
    {
      id: 'u1',
      username: 'zain',
      password: 'pass123',
      name: 'Zain',
      tagline: 'Creative Director & Urban Architect',
      bio: 'Lover of Mughal architecture, doodh patti chai, and hiking the Karakorams. I build spaces that breathe life into cities.',
      occupation: 'Creative Director',
      contact: 'zain@example.com',
      location: 'Karachi, Pakistan',
      joined: '2023-03-14',
      avatar: null,
      initials: 'AR',
      color: '#2E5A44',
      lastLogin: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
    },
    {
      id: 'u2',
      username: 'wasif',
      password: 'pass123',
      name: 'Wasif',
      tagline: 'Botanical Illustrator · Nature Enthusiast',
      bio: 'I paint Himalayan wildflowers in watercolors. Every petal tells a story of the north.',
      occupation: 'Botanical Illustrator',
      contact: 'wasif@example.com',
      location: 'Lahore, Pakistan',
      joined: '2023-05-22',
      avatar: null,
      initials: 'SK',
      color: '#7C6A52',
      lastLogin: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 min ago
    },
    {
      id: 'u3',
      username: 'saad',
      password: 'pass123',
      name: 'Saad',
      tagline: 'Music Producer · Coke Studio Enthusiast',
      bio: 'Blending classical ragas with modern beats. If Nusrat sahab could do it, so can we. Analog is my religion.',
      occupation: 'Music Producer',
      contact: 'saad@example.com',
      location: 'Islamabad, Pakistan',
      joined: '2023-01-08',
      avatar: null,
      initials: 'BH',
      color: '#3B5A7A',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
    },
    {
      id: 'u4',
      username: 'daniyal',
      password: 'pass123',
      name: 'Daniyal',
      tagline: 'Travel Blogger · Street Photographer',
      bio: "Visited 40+ countries and nothing beats the warmth of Peshawar's Old City. Still chasing the perfect shot.",
      occupation: 'Travel Blogger',
      contact: 'daniyal@example.com',
      location: 'Peshawar, Pakistan',
      joined: '2023-09-01',
      avatar: null,
      initials: 'ZM',
      color: '#8B5E3C',
      lastLogin: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: 'u5',
      username: 'abdullah',
      password: 'pass123',
      name: 'Abdullah',
      tagline: 'UX Researcher · Coffee-Fueled Thinker',
      bio: 'I spend my days asking "why" until someone gives me a good answer. Passionate about building inclusive digital products for Pakistan.',
      occupation: 'UX Researcher',
      contact: 'abdullah@example.com',
      location: 'Rawalpindi, Pakistan',
      joined: '2024-02-11',
      avatar: null,
      initials: 'NI',
      color: '#5B4A6B',
    },
    {
      id: 'u6',
      username: 'farrukh',
      password: 'pass123',
      name: 'Farrukh Shah',
      tagline: 'Fiction Writer · Night Owl',
      bio: 'Words are the only currency I trust. Writing Urdu-inspired English fiction one sleepless Quetta night at a time.',
      occupation: 'Fiction Writer',
      contact: 'farrukh@shahink.pk',
      location: 'Quetta, Pakistan',
      joined: '2023-11-30',
      avatar: null,
      initials: 'FS',
      color: '#4A4A6A',
    },
  ],

  // friendships[userId] = array of friend userIds
  friendships: {
    u1: ['u2', 'u3', 'u4'],
    u2: ['u1', 'u3'],
    u3: ['u1', 'u2', 'u4'],
    u4: ['u1', 'u3'],
    u5: [],
    u6: [],
  },

  // ratings[raterId][ratedId] = 1 | 2 | 3
  ratings: {
    u1: { u2: 2, u3: 3, u4: 1 },
    u2: { u1: 3, u3: 2 },
    u3: { u1: 3, u2: 2, u4: 1 },
  },

  // ignoreLists[userId] = array of userIds they ignore
  ignoreLists: {
    u1: [],
    u2: [],
    u3: [],
    u4: [],
    u5: [],
    u6: ['u1'], // Farrukh ignores Zain: demonstrates a blocked invitation.
  },

  // friendRequests[toId] = array of fromIds pending
  friendRequests: {
    u1: ['u5'],
    u2: [],
    u3: [],
    u4: [],
    u5: [],
    u6: [],
  },

  posts: [
    {
      id: 'p1',
      authorId: 'u2',
      text: 'Just completed a new series of botanical illustrations — wildflowers from the Kaghan Valley. The Himalayas never run out of surprises. 🌿',
      audience: 'all',
      timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      likes: ['u1', 'u3'],
      dislikes: [],
      comments: [
        {
          id: 'c1',
          authorId: 'u1',
          text: 'These look breathtaking Wasif! Would love to frame one.',
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: 'p2',
      authorId: 'u3',
      text: "Just wrapped a new Coke Studio-inspired session — blending a Sufi kafi with lo-fi beats. It's raw, it's real. Watch this space. 🎷",
      audience: 'all',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      likes: ['u1', 'u2', 'u4'],
      dislikes: ['u5'],
      comments: [
        {
          id: 'c2',
          authorId: 'u4',
          text: 'Can not wait to hear this Saad! Drop the snippet soon.',
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: 'p3',
      authorId: 'u2',
      text: "Quick reminder: spring wildflowers on the Deosai plains only last 3 weeks. Book your trip now before it's too late. 🏔️",
      audience: ['u1', 'u3'],
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      likes: ['u1'],
      dislikes: [],
      comments: [],
    },
    {
      id: 'p4',
      authorId: 'u4',
      text: 'Just landed in Hunza after a crazy 14-hour road trip from Rawalpindi. The cherry blossom season here is absolutely unreal. 🌸',
      audience: 'all',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: [],
      dislikes: ['u1'],
      comments: [],
    },
    {
      id: 'p5',
      authorId: 'u3',
      text: 'New home studio setup is finally complete! Acoustic foam panels and all. Time to start recording the new EP. 🎛️',
      audience: ['u1'],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      likes: ['u1'],
      dislikes: [],
      comments: [],
    },
  ],

  messages: [
    {
      id: 'm1',
      fromId: 'u1',
      toId: 'u2',
      text: 'Wasif! Your Kaghan wildflower series sounds incredible — can I get a sneak peek?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'm2',
      fromId: 'u2',
      toId: 'u1',
      text: "Of course! I'll send the digital scans tomorrow morning, InshAllah. 🌸",
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: 'm3',
      fromId: 'u3',
      toId: 'u1',
      text: 'Zain bhai — I need your take on the studio acoustics. Come by this weekend?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'm4',
      fromId: 'u1',
      toId: 'u3',
      text: 'Saad, absolutely! Saturday works perfectly for me.',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// Original vector portraits provide profile pictures without external image requests.
SEED.users.forEach((user) => {
  user.avatar = `assets/avatars/${user.id}.svg`;
});
const PHOTO_USERS = [
  {
    id: 'u1',
    name: 'Zain',
    username: 'zain',
    contact: 'zain@example.com',
    initials: 'Z',
    avatar: 'assets/avatars/zain.jpeg',
  },
  {
    id: 'u2',
    name: 'Wasif',
    username: 'wasif',
    contact: 'wasif@example.com',
    initials: 'W',
    avatar: 'assets/avatars/wasif.jpeg',
  },
  {
    id: 'u3',
    name: 'Saad',
    username: 'saad',
    contact: 'saad@example.com',
    initials: 'S',
    avatar: 'assets/avatars/saad.jpeg',
  },
  {
    id: 'u4',
    name: 'Daniyal',
    username: 'daniyal',
    contact: 'daniyal@example.com',
    initials: 'D',
    avatar: 'assets/avatars/daniyal.jpeg',
  },
  {
    id: 'u5',
    name: 'Abdullah',
    username: 'abdullah',
    contact: 'abdullah@example.com',
    initials: 'A',
    avatar: 'assets/avatars/abdullah.jpeg',
  },
];
PHOTO_USERS.forEach((person) =>
  Object.assign(
    SEED.users.find((user) => user.id === person.id),
    person,
  ),
);
SEED.photoRevision = 1;
SEED.emailRevision = 1;
SEED.contentRevision = 1;
const Store = (() => {
  let state;
  let storageAvailable = true;
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const id = (prefix) =>
    prefix +
    (globalThis.crypto?.randomUUID?.() ||
      Date.now() + '-' + Math.random().toString(36).slice(2));
  function valid(data) {
    return (
      data &&
      Array.isArray(data.users) &&
      data.users.length &&
      Array.isArray(data.posts) &&
      Array.isArray(data.messages) &&
      ['friendships', 'ratings', 'ignoreLists', 'friendRequests'].every(
        (key) => data[key] && typeof data[key] === 'object',
      )
    );
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      state = valid(parsed) ? parsed : clone(SEED);
    } catch {
      state = clone(SEED);
      storageAvailable = false;
    }
    // Upgrade existing demo accounts without resetting friendships, news, or messages.
    if (state.photoRevision !== 1) {
      PHOTO_USERS.forEach((person) => {
        const user = state.users.find((member) => member.id === person.id);
        if (user) Object.assign(user, person);
      });
      state.photoRevision = 1;
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
      } catch {
        storageAvailable = false;
      }
    }
    if (state.emailRevision !== 1) {
      PHOTO_USERS.forEach((person) => {
        const user = state.users.find((member) => member.id === person.id);
        if (user) user.contact = person.contact;
      });
      state.emailRevision = 1;
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
      } catch {
        storageAvailable = false;
      }
    }
    // Refresh only starter content; preserve messages and posts written by the user.
    if (state.contentRevision !== 1) {
      state.messages.forEach((message) => {
        const starter = SEED.messages.find((item) => item.id === message.id);
        if (starter) message.text = starter.text;
      });
      state.posts.forEach((post) => {
        const starter = SEED.posts.find((item) => item.id === post.id);
        if (!starter) return;
        (post.comments || []).forEach((comment) => {
          const original = starter.comments.find(
            (item) => item.id === comment.id,
          );
          if (original) comment.text = original.text;
        });
      });
      state.contentRevision = 1;
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
      } catch {
        storageAvailable = false;
      }
    }
  }
  function mutate(action) {
    const before = clone(state);
    const result = action();
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      state = before;
      storageAvailable = false;
      throw new Error('Could not save your changes. Please try again.');
    }
    return result;
  }
  function reset() {
    mutate(() => {
      state = clone(SEED);
    });
    logout();
  }
  const getUsers = () => clone(state.users);
  const getUserById = (userId) =>
    clone(state.users.find((user) => user.id === userId) || null);
  const getUserByUsername = (username) =>
    getUsers().find(
      (user) => user.username === String(username).trim().toLowerCase(),
    ) || null;
  function checkUser(userId) {
    if (!getUserById(userId))
      throw new Error('This member could not be found.');
  }
  function checkPair(first, second) {
    checkUser(first);
    checkUser(second);
    if (first === second) throw new Error('Choose another member.');
  }
  function checkActor(userId) {
    if (getCurrentUser()?.id !== userId)
      throw new Error('Sign in to perform this action.');
  }
  function textValue(text, limit) {
    const value = String(text).trim();
    if (!value) throw new Error('Please write something first.');
    if (value.length > limit)
      throw new Error(`Keep your message within ${limit} characters.`);
    return value;
  }
  function getCurrentUser() {
    try {
      return getUserById(
        sessionStorage.getItem('cf_current_v3') ||
          localStorage.getItem('cf_remember_v3'),
      );
    } catch {
      return null;
    }
  }
  function login(username, password, remember = false) {
    const user = getUserByUsername(username);
    if (!user || user.password !== password) return null;
    // Session storage is isolated per browser tab; remembered accounts survive tab closure.
    try {
      sessionStorage.setItem('cf_current_v3', user.id);
      if (remember) localStorage.setItem('cf_remember_v3', user.id);
      else localStorage.removeItem('cf_remember_v3');
      mutate(() => {
        state.users.find((member) => member.id === user.id).lastLogin =
          new Date().toISOString();
      });
    } catch (error) {
      logout();
      throw error;
    }
    return getUserById(user.id);
  }
  function logout() {
    try {
      sessionStorage.removeItem('cf_current_v3');
      localStorage.removeItem('cf_remember_v3');
    } catch {
      /* Login will report storage errors. */
    }
  }
  function updateUser(userId, fields) {
    checkActor(userId);
    const allowed = [
      'name',
      'tagline',
      'bio',
      'occupation',
      'contact',
      'location',
      'avatar',
    ];
    const clean = Object.fromEntries(
      Object.entries(fields).filter(([key]) => allowed.includes(key)),
    );
    if ('name' in clean) clean.name = textValue(clean.name, 60);
    for (const key of ['tagline', 'occupation', 'location'])
      if (key in clean) clean[key] = String(clean[key]).trim().slice(0, 120);
    if ('bio' in clean) clean.bio = String(clean.bio).trim().slice(0, 500);
    if ('contact' in clean && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.contact))
      throw new Error('Enter a valid email address.');
    if (
      'avatar' in clean &&
      !/^assets\/avatars\/(?:u[1-6]\.svg|(?:zain|wasif|saad|daniyal|abdullah)\.jpeg)$|^data:image\/(png|jpeg|webp);base64,/.test(
        clean.avatar,
      )
    )
      throw new Error('Choose a PNG, JPEG, or WebP profile picture.');
    return mutate(() =>
      Object.assign(
        state.users.find((user) => user.id === userId),
        clean,
      ),
    );
  }
  const getFriendIds = (userId) => [...(state.friendships[userId] || [])];
  const areFriends = (first, second) => getFriendIds(first).includes(second);
  const getFriends = (userId) =>
    getFriendIds(userId).map(getUserById).filter(Boolean);
  const getFriendsSortedByLogin = (userId) =>
    getFriends(userId).sort(
      (a, b) => (Date.parse(b.lastLogin) || 0) - (Date.parse(a.lastLogin) || 0),
    );
  const isIgnored = (byId, targetId) =>
    (state.ignoreLists[byId] || []).includes(targetId);
  const getIgnoreList = (userId) =>
    (state.ignoreLists[userId] || []).map(getUserById).filter(Boolean);
  const hasRequest = (fromId, toId) =>
    (state.friendRequests[toId] || []).includes(fromId);
  const getPendingRequests = (userId) =>
    (state.friendRequests[userId] || []).map(getUserById).filter(Boolean);
  function sendFriendRequest(fromId, toId) {
    checkActor(fromId);
    checkPair(fromId, toId);
    // Check the RECIPIENT's ignore list, not just the sender's.
    if (isIgnored(toId, fromId)) return { success: false, reason: 'ignored' };
    if (isIgnored(fromId, toId))
      return { success: false, reason: 'you_ignored' };
    if (areFriends(fromId, toId))
      return { success: false, reason: 'already_friends' };
    if (hasRequest(fromId, toId))
      return { success: false, reason: 'already_sent' };
    if (hasRequest(toId, fromId)) return { success: false, reason: 'incoming' };
    return mutate(() => {
      (state.friendRequests[toId] ||= []).push(fromId);
      return { success: true };
    });
  }
  function acceptFriendRequest(fromId, toId) {
    checkActor(toId);
    checkPair(fromId, toId);
    if (!hasRequest(fromId, toId))
      throw new Error('This invitation is no longer pending.');
    if (isIgnored(toId, fromId) || isIgnored(fromId, toId))
      throw new Error(
        'Remove this member from the ignore list before connecting.',
      );
    mutate(() => {
      if (!areFriends(fromId, toId)) {
        (state.friendships[fromId] ||= []).push(toId);
        (state.friendships[toId] ||= []).push(fromId);
      }
      state.friendRequests[toId] = state.friendRequests[toId].filter(
        (userId) => userId !== fromId,
      );
      state.friendRequests[fromId] = (
        state.friendRequests[fromId] || []
      ).filter((userId) => userId !== toId);
    });
  }
  function declineFriendRequest(fromId, toId) {
    checkActor(toId);
    mutate(() => {
      state.friendRequests[toId] = (state.friendRequests[toId] || []).filter(
        (userId) => userId !== fromId,
      );
    });
  }
  function cancelFriendRequest(fromId, toId) {
    checkActor(fromId);
    mutate(() => {
      state.friendRequests[toId] = (state.friendRequests[toId] || []).filter(
        (userId) => userId !== fromId,
      );
    });
  }
  function toggleIgnore(byId, targetId) {
    checkActor(byId);
    checkPair(byId, targetId);
    return mutate(() => {
      const list = (state.ignoreLists[byId] ||= []);
      const ignored = !list.includes(targetId);
      state.ignoreLists[byId] = ignored
        ? [...list, targetId]
        : list.filter((userId) => userId !== targetId);
      // Discard existing invitations in either direction when ignoring a member.
      if (ignored) {
        state.friendRequests[byId] = (state.friendRequests[byId] || []).filter(
          (userId) => userId !== targetId,
        );
        state.friendRequests[targetId] = (
          state.friendRequests[targetId] || []
        ).filter((userId) => userId !== byId);
      }
      return ignored;
    });
  }
  function removeFriend(first, second) {
    checkActor(first);
    checkPair(first, second);
    mutate(() => {
      state.friendships[first] = getFriendIds(first).filter(
        (userId) => userId !== second,
      );
      state.friendships[second] = getFriendIds(second).filter(
        (userId) => userId !== first,
      );
      if (state.ratings[first]) delete state.ratings[first][second];
      if (state.ratings[second]) delete state.ratings[second][first];
    });
  }
  const getRating = (raterId, ratedId) =>
    (state.ratings[raterId] || {})[ratedId] || null;
  const getRatingLabel = (value) =>
    ({ 1: 'Stupid', 2: 'Cool', 3: 'Trustworthy' })[value] || 'Not rated';
  function setRating(raterId, ratedId, value) {
    checkActor(raterId);
    if (!areFriends(raterId, ratedId))
      throw new Error('Only friends can be rated.');
    if (![1, 2, 3, null].includes(value))
      throw new Error('Choose a rating from 1 to 3.');
    mutate(() => {
      const ratings = (state.ratings[raterId] ||= {});
      if (value === null) delete ratings[ratedId];
      else ratings[ratedId] = value;
    });
  }
  function getRatingsReceived(userId) {
    const counts = { 1: 0, 2: 0, 3: 0 };
    Object.entries(state.ratings).forEach(([rater, ratings]) => {
      if (areFriends(rater, userId) && ratings[userId])
        counts[ratings[userId]]++;
    });
    return counts;
  }
  const getPosts = () => clone(state.posts);
  function getVisiblePosts(viewerId) {
    return getPosts()
      .filter((post) => {
        if (post.authorId === viewerId) return true;
        if (
          !areFriends(viewerId, post.authorId) ||
          isIgnored(viewerId, post.authorId)
        )
          return false;
        return (
          post.audience === 'all' ||
          (Array.isArray(post.audience) && post.audience.includes(viewerId))
        );
      })
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  }
  function createPost(authorId, text, audience) {
    checkActor(authorId);
    const content = textValue(text, 1200);
    if (audience !== 'all') {
      if (!Array.isArray(audience) || !audience.length)
        throw new Error('Select at least one friend for this update.');
      audience = [...new Set(audience)];
      if (audience.some((userId) => !areFriends(authorId, userId)))
        throw new Error('News can only be shared with your friends.');
    }
    return mutate(() => {
      const post = {
        id: id('p'),
        authorId,
        text: content,
        audience,
        timestamp: new Date().toISOString(),
        likes: [],
        dislikes: [],
        comments: [],
      };
      state.posts.unshift(post);
      return clone(post);
    });
  }
  function reaction(postId, userId, type) {
    checkActor(userId);
    if (!getVisiblePosts(userId).some((post) => post.id === postId))
      throw new Error('You cannot react to this update.');
    return mutate(() => {
      const post = state.posts.find((item) => item.id === postId);
      const opposite = type === 'likes' ? 'dislikes' : 'likes';
      post[opposite] = post[opposite].filter((memberId) => memberId !== userId);
      post[type] = post[type].includes(userId)
        ? post[type].filter((memberId) => memberId !== userId)
        : [...post[type], userId];
      return clone(post);
    });
  }
  const toggleLike = (postId, userId) => reaction(postId, userId, 'likes');
  const toggleDislike = (postId, userId) =>
    reaction(postId, userId, 'dislikes');
  const getMessages = () => clone(state.messages);
  const getConversation = (first, second) =>
    getMessages()
      .filter(
        (message) =>
          (message.fromId === first && message.toId === second) ||
          (message.fromId === second && message.toId === first),
      )
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  function sendMessage(fromId, toId, text) {
    checkActor(fromId);
    checkPair(fromId, toId);
    // Messaging is deliberately open to all members, including non-friends.
    return mutate(() => {
      const message = {
        id: id('m'),
        fromId,
        toId,
        text: textValue(text, 2000),
        timestamp: new Date().toISOString(),
      };
      state.messages.push(message);
      return clone(message);
    });
  }
  const getConversationPartners = (userId) =>
    [
      ...new Set(
        state.messages
          .filter(
            (message) => message.fromId === userId || message.toId === userId,
          )
          .map((message) =>
            message.fromId === userId ? message.toId : message.fromId,
          ),
      ),
    ]
      .map(getUserById)
      .filter(Boolean)
      .sort((a, b) => {
        const lastA = getConversation(userId, a.id).at(-1),
          lastB = getConversation(userId, b.id).at(-1);
        return Date.parse(lastB.timestamp) - Date.parse(lastA.timestamp);
      });
  function timeAgo(date) {
    if (!date) return 'Not yet logged in';
    const minutes = Math.max(
      0,
      Math.floor((Date.now() - Date.parse(date)) / 60000),
    );
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  }
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  load();
  return {
    load,
    reset,
    storageAvailable: () => storageAvailable,
    getUsers,
    getUserById,
    getUserByUsername,
    getCurrentUser,
    login,
    logout,
    updateUser,
    getFriendIds,
    getFriends,
    getFriendsSortedByLogin,
    areFriends,
    isIgnored,
    getIgnoreList,
    hasRequest,
    getPendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    toggleIgnore,
    removeFriend,
    getRating,
    getRatingLabel,
    setRating,
    getRatingsReceived,
    getPosts,
    getVisiblePosts,
    createPost,
    toggleLike,
    toggleDislike,
    getMessages,
    getConversation,
    getConversationPartners,
    sendMessage,
    timeAgo,
    formatTime,
  };
})();
