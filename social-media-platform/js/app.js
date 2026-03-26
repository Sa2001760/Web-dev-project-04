let currentFeed = "recent";
// USERS
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// POSTS
function getPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}

function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// SESSION
function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// CLEAR viewed user 
function clearViewUser() {
  localStorage.removeItem("viewUser");
}

// REGISTER
function register(e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  let users = getUsers();

  if (users.find(u => u.username === username)) {
    alert("Username already exists");
    return;
  }

  users.push({
    fullname,
    username,
    password,
    bio: "",
    followers: [],   
    following: []    
  });

  saveUsers(users);

  alert("Registered!");
  window.location.href = "login.html";
}

// LOGIN
function login(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  let users = getUsers();

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Invalid login");
    return;
  }

  setCurrentUser(user);
  window.location.href = "index.html";
}

// CREATE POST
function createPost() {
  const content = document.getElementById("postContent").value;
  const user = getCurrentUser();

  if (!content.trim()) {
    alert("Post cannot be empty");
    return;
  }

  let posts = getPosts();

  posts.push({
    id: Date.now() + Math.random(),
    user: user.username,
    content: content,
    likes: [],
    comments: [], 
    timestamp: new Date().toISOString()
  });

  savePosts(posts);

  document.getElementById("postContent").value = "";
  loadPosts();
}
// TIMESTAMP
function formatTime(timestamp) {
  const now = new Date();
  const postTime = new Date(timestamp);

  const diff = Math.floor((now - postTime) / 1000); // seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";

  return Math.floor(diff / 86400) + "d ago";
}
// COMMENT
function addComment(postId) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const input = document.getElementById("comment-" + postId);
  const text = input.value;

  if (!text.trim()) return;

  let posts = getPosts();

  posts = posts.map(p => {
    if (p.id === postId) {
      if (!p.comments) p.comments = [];

      p.comments.push({
        user: currentUser.username,
        text: text
      });
    }
    return p;
  });

  savePosts(posts);
  loadPosts();
}
function toggleComments(postId) {
  const section = document.getElementById("comments-" + postId);

  if (section.style.display === "none") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}
// SWITCH FEED
function switchFeed(type) {
  currentFeed = type;

  document.getElementById("recentTab").classList.remove("active");
  document.getElementById("followingTab").classList.remove("active");

  if (type === "recent") {
    document.getElementById("recentTab").classList.add("active");
  } else {
    document.getElementById("followingTab").classList.add("active");
  }

  loadPosts();
}
// FOLLOW
function toggleFollow(usernameToFollow) {
  const currentUser = getCurrentUser();
  let users = getUsers();

  let me = users.find(u => u.username === currentUser.username);
  let target = users.find(u => u.username === usernameToFollow);

  if (!me || !target) return;

  // initialize if missing
  if (!me.following) me.following = [];
  if (!target.followers) target.followers = [];

  if (me.following.includes(usernameToFollow)) {
    // UNFOLLOW
    me.following = me.following.filter(u => u !== usernameToFollow);
    target.followers = target.followers.filter(u => u !== me.username);
  } else {
    // FOLLOW
    me.following.push(usernameToFollow);
    target.followers.push(me.username);
  }

  saveUsers(users);

  // update session
  setCurrentUser(me);

  loadProfile();
}
//SEARCH USER
function searchUser() {
  const input = document.getElementById("searchInput");
  const query = input.value.trim().toLowerCase();

  if (!query) {
    alert("Enter a username");
    return;
  }

  const users = getUsers();

  const found = users.find(u =>
    u.username && u.username.toLowerCase() === query
  );

  if (!found) {
    alert("User not found");
    return;
  }

  localStorage.setItem("viewUser", found.username);
  window.location.href = "profile.html";
}
// LOAD POSTS (HOME)
function loadPosts() {
  const container = document.getElementById("posts");
  if (!container) return;

let posts = getPosts();
const currentUser = getCurrentUser();

if (currentFeed === "following") {
  posts = posts.filter(p =>
    p.user === currentUser.username ||
    (currentUser.following && currentUser.following.includes(p.user))
  );
}

  if (!posts || posts.length === 0) {
    container.innerHTML = "<p>No posts yet...</p>";
    return;
  }

  container.innerHTML = posts.map(p => {

    if (!p.likes) p.likes = [];
    if (!p.comments) p.comments = [];

    const liked = currentUser && p.likes.includes(currentUser.username);

    return `
      <div class="post-card">

        <div class="post-header">
          <div class="avatar">${p.user[0].toUpperCase()}</div>
          <div>
            <strong onclick="viewProfile('${p.user}')" style="cursor:pointer;">
              ${p.user}
            </strong>
            <div class="post-time">
              ${p.timestamp ? formatTime(p.timestamp) : "Just now"}
            </div>
          </div>
        </div>

        <p>${p.content}</p>

        <button class="like-btn ${liked ? 'liked' : ''}" 
          onclick="toggleLike(${p.id})">
          ${liked ? '💔 Unlike' : '❤️ Like'} (${p.likes.length})
        </button>

        <button class="comment-toggle-btn" onclick="toggleComments(${p.id})">
          💬 Comments (${p.comments.length})
        </button>

        <div id="comments-${p.id}" class="comments-section" style="display:none;">

          <div class="comments">
            ${p.comments.map(c => `
              <div class="comment">
                <strong>${c.user}:</strong> ${c.text}
              </div>
            `).join("")}
          </div>

          <div class="comment-box">
            <input id="comment-${p.id}" placeholder="Write a comment...">
            <button onclick="addComment(${p.id})">Post</button>
          </div>

        </div>

      </div>
    `;
  }).join("");
}

// LIKE / UNLIKE
function toggleLike(id) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  let posts = getPosts();

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === id) {

      if (!posts[i].likes) posts[i].likes = [];

      if (posts[i].likes.includes(currentUser.username)) {
        posts[i].likes = posts[i].likes.filter(u => u !== currentUser.username);
      } else {
        posts[i].likes.push(currentUser.username);
      }

      break;
    }
  }

  savePosts(posts);
  loadPosts();
}

// VIEW OTHER PROFILE
function viewProfile(username) {
  localStorage.setItem("viewUser", username);
  window.location.href = "profile.html";
}

// DELETE POST
function deletePost(id) {
  if (!confirm("Delete this post?")) return;

  let posts = getPosts();
  posts = posts.filter(p => p.id !== id);

  savePosts(posts);
  loadProfile();
}

// EDIT BIO
function editBio() {
  const currentUser = getCurrentUser();
  const viewUser = localStorage.getItem("viewUser");

  //prevent editing other users
  if (viewUser && viewUser !== currentUser.username) return;

  document.getElementById("bioInput").style.display = "block";
  document.getElementById("saveBtn").style.display = "inline";
  document.getElementById("editBtn").style.display = "none";

  document.getElementById("bioText").style.display = "none";

  document.getElementById("bioInput").value =
    document.getElementById("bioText").innerText;
}

// SAVE BIO
function saveBio() {
  const currentUser = getCurrentUser();
  const viewUser = localStorage.getItem("viewUser");

  //prevent editing other users
  if (viewUser && viewUser !== currentUser.username) return;

  if (!currentUser) return;

  const newBio = document.getElementById("bioInput").value;

  let users = getUsers();

  users = users.map(u => {
    if (u.username === currentUser.username) {
      u.bio = newBio;
    }
    return u;
  });

  saveUsers(users);

  currentUser.bio = newBio;
  setCurrentUser(currentUser);

  document.getElementById("bioInput").style.display = "none";
  document.getElementById("saveBtn").style.display = "none";
  document.getElementById("editBtn").style.display = "inline";
  document.getElementById("bioText").style.display = "block";

  localStorage.removeItem("viewUser");

  loadProfile();
}

// CHECK LOGIN
function checkAuth() {
  if (!getCurrentUser()) {
    window.location.href = "login.html";
  }
}

// LOAD PROFILE
function loadProfile() {

  let viewUser = localStorage.getItem("viewUser");
  let user;

  if (viewUser) {
    user = getUsers().find(u => u.username === viewUser);
  } else {
    user = getCurrentUser();
  }

  if (!user) return;

  const currentUser = getCurrentUser();
  const isOwner = currentUser && user.username === currentUser.username;

  let posts = getPosts();
  let myPosts = posts.filter(p => p.user === user.username);

  // BASIC INFO
  document.getElementById("usernameDisplay").innerText = user.username;
  document.getElementById("handle").innerText = "@" + user.username;

  document.getElementById("avatar").innerText =
    user.username.substring(0, 2).toUpperCase();

  // POSTS COUNT
  document.getElementById("postCount").innerText = myPosts.length;

  // LIKES COUNT
  let totalLikes = 0;
  myPosts.forEach(p => {
    if (p.likes) totalLikes += p.likes.length;
  });
  document.getElementById("likeCount").innerText = totalLikes;

  // FOLLOW COUNTS
  document.getElementById("followerCount").innerText =
    user.followers ? user.followers.length : 0;

  document.getElementById("followingCount").innerText =
    user.following ? user.following.length : 0;

  // BIO
  document.getElementById("bioText").innerText =
    user.bio || "Hey there! I am using Social Media.";

  //EDIT BIO CONTROL 
  const editBtn = document.getElementById("editBtn");
  const bioInput = document.getElementById("bioInput");
  const saveBtn = document.getElementById("saveBtn");

  if (isOwner) {
    editBtn.style.display = "inline";
  } else {
    editBtn.style.display = "none";
    bioInput.style.display = "none";
    saveBtn.style.display = "none";
  }

  // FOLLOW BUTTON
  const followContainer = document.getElementById("followBtnContainer");

  if (user.username !== currentUser.username) {

    const isFollowing =
      currentUser.following &&
      currentUser.following.includes(user.username);

    followContainer.innerHTML = `
      <button class="follow-btn" onclick="toggleFollow('${user.username}')">
        ${isFollowing ? "Unfollow" : "Follow"}
      </button>
    `;
  } else {
    followContainer.innerHTML = "";
  }
  
  // POSTS DISPLAY
  const container = document.getElementById("posts");

  if (myPosts.length === 0) {
    container.innerHTML = `<div class="card">No posts yet.</div>`;
    return;
  }

  container.innerHTML = myPosts.map(p => {

    if (!p.likes) p.likes = [];
    if (!p.comments) p.comments = [];

    return `
      <div class="post-card">

        <div class="post-time">
          ${p.timestamp ? formatTime(p.timestamp) : "Just now"}
        </div>

        <p>${p.content}</p>

        <button class="comment-toggle-btn" onclick="toggleComments(${p.id})">
          💬 Comments (${p.comments.length})
        </button>

        <div id="comments-${p.id}" class="comments-section" style="display:none;">
          <div class="comments">
            ${p.comments.map(c => `
              <div class="comment">
                <strong>${c.user}:</strong> ${c.text}
              </div>
            `).join("")}
          </div>

          <div class="comment-box">
            <input id="comment-${p.id}" placeholder="Write a comment...">
            <button onclick="addComment(${p.id})">Post</button>
          </div>
        </div>

        ${isOwner ? `
          <button class="delete-btn" onclick="deletePost(${p.id})">
            🗑 Delete
          </button>
        ` : ""}

      </div>
    `;
  }).join("");
}