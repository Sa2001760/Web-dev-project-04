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
async function register(event) {
  // e.preventDefault();

  // const fullname = document.getElementById("fullname").value;
  // const username = document.getElementById("username").value;
  // const password = document.getElementById("password").value;

  // let users = getUsers();

  // if (users.find(u => u.username === username)) {
  //   alert("Username already exists");
  //   return;
  // }

  // users.push({
  //   fullname,
  //   username,
  //   password,
  //   bio: "",
  //   followers: [],
  //   following: []
  // });

  // saveUsers(users);

  // alert("Registered!");
  // window.location.href = "login.html";

  event.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname,
        username,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("User registered!");
      window.location.href = "login.html";
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
  }
}

// LOGIN
async function login(event) {
  // e.preventDefault();

  // const username = document.getElementById("username").value;
  // const password = document.getElementById("password").value;

  // let users = getUsers();

  // const user = users.find(u => u.username === username && u.password === password);

  // if (!user) {
  //   alert("Invalid login");
  //   return;
  // }

  // setCurrentUser(user);
  // window.location.href = "index.html";

  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/users");
    const users = await res.json();

    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
  }
}

// CREATE POST
async function createPost() {
  // const content = document.getElementById("postContent").value;
  // const user = getCurrentUser();

  // if (!content.trim()) {
  //   alert("Post cannot be empty");
  //   return;
  // }

  // let posts = getPosts();

  // posts.push({
  //   id: Date.now() + Math.random(),
  //   user: user.username,
  //   content: content,
  //   likes: [],
  //   comments: [],
  //   timestamp: new Date().toISOString()
  // });

  // savePosts(posts);

  // document.getElementById("postContent").value = "";
  // loadPosts();

  const content = document.getElementById("postContent").value;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!content || !currentUser) return;

  try {
    await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        userId: currentUser.id,
      }),
    });

    document.getElementById("postContent").value = "";

    loadPosts(); // refresh feed
  } catch (error) {
    console.error(error);
  }
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
async function addComment(postId) {
  // const currentUser = getCurrentUser();
  // if (!currentUser) return;

  // const input = document.getElementById("comment-" + postId);
  // const text = input.value;

  // if (!text.trim()) return;

  // let posts = getPosts();

  // posts = posts.map((p) => {
  //   if (p.id === postId) {
  //     if (!p.comments) p.comments = [];

  //     p.comments.push({
  //       user: currentUser.username,
  //       text: text,
  //     });
  //   }
  //   return p;
  // });

  // savePosts(posts);
  // loadPosts();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  const input = document.getElementById(`comment-input-${postId}`);
  const text = input.value;

  if (!text) return;

  await fetch("http://localhost:3000/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      userId: currentUser.id,
      postId: postId,
    }),
  });

  input.value = "";

  loadPosts(); // refresh to show comment
}
function toggleComments(postId) {
  const section = document.getElementById(`comments-${postId}`);

  if (section.style.display === "none") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
  // const section = document.getElementById("comments-" + postId);

  // if (section.style.display === "none") {
  //   section.style.display = "block";
  // } else {
  //   section.style.display = "none";
  // }
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
async function toggleFollow(targetUserId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  // get users
  const res = await fetch("http://localhost:3000/api/users");
  const users = await res.json();

  const target = users.find((u) => u.id === targetUserId);

  const isFollowing = target.followers.some(
    (f) => f.followerId === currentUser.id,
  );

  if (isFollowing) {
    await fetch("http://localhost:3000/api/follow", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: currentUser.id,
        followingId: targetUserId,
      }),
    });
  } else {
    await fetch("http://localhost:3000/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: currentUser.id,
        followingId: targetUserId,
      }),
    });
  }

  loadProfile();

  // const currentUser = getCurrentUser();
  // let users = getUsers();

  // let me = users.find((u) => u.username === currentUser.username);
  // let target = users.find((u) => u.username === usernameToFollow);

  // if (!me || !target) return;

  // // initialize if missing
  // if (!me.following) me.following = [];
  // if (!target.followers) target.followers = [];

  // if (me.following.includes(usernameToFollow)) {
  //   // UNFOLLOW
  //   me.following = me.following.filter((u) => u !== usernameToFollow);
  //   target.followers = target.followers.filter((u) => u !== me.username);
  // } else {
  //   // FOLLOW
  //   me.following.push(usernameToFollow);
  //   target.followers.push(me.username);
  // }

  // saveUsers(users);

  // // update session
  // setCurrentUser(me);

  // loadProfile();
}
//SEARCH USER
function searchUser() {
  const input = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  fetch("http://localhost:3000/api/users")
    .then((res) => res.json())
    .then((users) => {
      const user = users.find((u) => u.username.toLowerCase() === input);

      if (!user) {
        alert("User not found");
        return;
      }

      localStorage.setItem("viewUser", user.username);
      window.location.href = "profile.html";
    })
    .catch((err) => console.error(err));

  // const input = document.getElementById("searchInput");
  // const query = input.value.trim().toLowerCase();

  // if (!query) {
  //   alert("Enter a username");
  //   return;
  // }

  // const users = getUsers();

  // const found = users.find(
  //   (u) => u.username && u.username.toLowerCase() === query,
  // );

  // if (!found) {
  //   alert("User not found");
  //   return;
  // }

  // localStorage.setItem("viewUser", found.username);
  // window.location.href = "profile.html";
}
// LOAD POSTS (HOME)
async function loadPosts() {
  try {
    const res = await fetch("http://localhost:3000/api/posts");
    let posts = await res.json();

    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentFeed === "following") {
      const usersRes = await fetch("http://localhost:3000/api/users");
      const users = await usersRes.json();

      const me = users.find((u) => u.id === currentUser.id);

      // get IDs of users I follow
      const followingIds = me.following.map((f) => f.followingId);

      // filter posts
      posts = posts.filter((p) => followingIds.includes(p.userId));
    }

    posts.forEach((post) => {
      const commentsHTML = post.comments
        .map((c) => `<p><b>${c.user.username}:</b> ${c.text}</p>`)
        .join("");
      postsContainer.innerHTML += `
  <div class="post-card">

    <div class="post-header">
      <div class="avatar">
        ${post.user.fullname[0]}
      </div>

      <div>
        <p 
          style="cursor:pointer; font-weight:bold; margin:0;"
          onclick="viewProfile('${post.user.username}')"
        >
          ${post.user.username}
        </p>
        <span class="post-time">
          ${new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
    </div>

    <p>${post.content}</p>

    <button 
      id="like-${post.id}" 
      class="like-btn"
      onclick="toggleLike(${post.id})"
    >
      ❤️ ${post.likes.length}
    </button>

    <button 
      class="comment-toggle-btn"
      onclick="toggleComments(${post.id})"
    >
      Show Comments
    </button>

    <div id="comments-${post.id}" class="comments-section" style="display:none;">

      <div class="comments">
        ${post.comments
          .map(
            (c) => `
          <div class="comment">
            <b>${c.user?.username || "unknown"}:</b> ${c.text}
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="comment-box">
        <input id="commentInput-${post.id}" placeholder="Write a comment...">
        <button onclick="addComment(${post.id})">Comment</button>
      </div>

    </div>

  </div>
`;
    });
  } catch (error) {
    console.error("Error loading posts:", error);
  }

  //   const container = document.getElementById("posts");
  //   if (!container) return;

  // let posts = getPosts();
  // const currentUser = getCurrentUser();

  // if (currentFeed === "following") {
  //   posts = posts.filter(p =>
  //     p.user === currentUser.username ||
  //     (currentUser.following && currentUser.following.includes(p.user))
  //   );
  // }

  //   if (!posts || posts.length === 0) {
  //     container.innerHTML = "<p>No posts yet...</p>";
  //     return;
  //   }

  //   container.innerHTML = posts.map(p => {

  //     if (!p.likes) p.likes = [];
  //     if (!p.comments) p.comments = [];

  //     const liked = currentUser && p.likes.includes(currentUser.username);

  //     return `
  //       <div class="post-card">

  //         <div class="post-header">
  //           <div class="avatar">${p.user[0].toUpperCase()}</div>
  //           <div>
  //             <strong onclick="viewProfile('${p.user}')" style="cursor:pointer;">
  //               ${p.user}
  //             </strong>
  //             <div class="post-time">
  //               ${p.timestamp ? formatTime(p.timestamp) : "Just now"}
  //             </div>
  //           </div>
  //         </div>

  //         <p>${p.content}</p>

  //         <button class="like-btn ${liked ? 'liked' : ''}"
  //           onclick="toggleLike(${p.id})">
  //           ${liked ? '💔 Unlike' : '❤️ Like'} (${p.likes.length})
  //         </button>

  //         <button class="comment-toggle-btn" onclick="toggleComments(${p.id})">
  //           💬 Comments (${p.comments.length})
  //         </button>

  //         <div id="comments-${p.id}" class="comments-section" style="display:none;">

  //           <div class="comments">
  //             ${p.comments.map(c => `
  //               <div class="comment">
  //                 <strong>${c.user}:</strong> ${c.text}
  //               </div>
  //             `).join("")}
  //           </div>

  //           <div class="comment-box">
  //             <input id="comment-${p.id}" placeholder="Write a comment...">
  //             <button onclick="addComment(${p.id})">Post</button>
  //           </div>

  //         </div>

  //       </div>
  //     `;
  //   }).join("");
}

// LIKE / UNLIKE
async function toggleLike(postId) {
  // const currentUser = getCurrentUser();
  // if (!currentUser) return;

  // let posts = getPosts();

  // for (let i = 0; i < posts.length; i++) {
  //   if (posts[i].id === id) {

  //     if (!posts[i].likes) posts[i].likes = [];

  //     if (posts[i].likes.includes(currentUser.username)) {
  //       posts[i].likes = posts[i].likes.filter(u => u !== currentUser.username);
  //     } else {
  //       posts[i].likes.push(currentUser.username);
  //     }

  //     break;
  //   }
  // }

  // savePosts(posts);
  // loadPosts();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  try {
    const res = await fetch("http://localhost:3000/api/posts");
    const posts = await res.json();

    const post = posts.find((p) => p.id === postId);

    const alreadyLiked = post.likes.some((l) => l.userId === currentUser.id);

    // 👉 store current count
    let newCount = post.likes.length;

    if (alreadyLiked) {
      await fetch("http://localhost:3000/api/likes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          postId: postId,
        }),
      });

      newCount--; // safer
    } else {
      await fetch("http://localhost:3000/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          postId: postId,
        }),
      });

      newCount++; // safer
    }

    // update UI
    const btn = document.getElementById(`like-${postId}`);
    if (btn) {
      btn.innerText = `❤️ ${newCount}`;
    }
  } catch (err) {
    console.error(err);
  }
}

// VIEW OTHER PROFILE
function viewProfile(username) {
  localStorage.setItem("viewUser", username);
  window.location.href = "profile.html";
}

// DELETE POST
async function deletePost(postId) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) return;

  if (!confirm("Delete this post?")) return;

  await fetch("http://localhost:3000/api/posts", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId,
      userId: currentUser.id,
    }),
  });

  loadProfile();
  // if (!confirm("Delete this post?")) return;

  // let posts = getPosts();
  // posts = posts.filter((p) => p.id !== id);

  // savePosts(posts);
  // loadProfile();
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
async function saveBio() {
  // const currentUser = getCurrentUser();
  // const viewUser = localStorage.getItem("viewUser");

  // //prevent editing other users
  // if (viewUser && viewUser !== currentUser.username) return;

  // if (!currentUser) return;

  // const newBio = document.getElementById("bioInput").value;

  // let users = getUsers();

  // users = users.map(u => {
  //   if (u.username === currentUser.username) {
  //     u.bio = newBio;
  //   }
  //   return u;
  // });

  // saveUsers(users);

  // currentUser.bio = newBio;
  // setCurrentUser(currentUser);

  // document.getElementById("bioInput").style.display = "none";
  // document.getElementById("saveBtn").style.display = "none";
  // document.getElementById("editBtn").style.display = "inline";
  // document.getElementById("bioText").style.display = "block";

  // localStorage.removeItem("viewUser");

  // loadProfile();

  const bio = document.getElementById("bioInput").value;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  try {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: currentUser.id,
        bio: bio,
      }),
    });

    const updatedUser = await res.json();

    // update localStorage so UI stays in sync
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // update UI
    document.getElementById("bioText").innerText = updatedUser.bio;
    document.getElementById("bioInput").style.display = "none";
    document.getElementById("bioText").style.display = "block";
    document.getElementById("saveBtn").style.display = "none";
    document.getElementById("editBtn").style.display = "inline";
  } catch (err) {
    console.error(err);
  }
}

// CHECK LOGIN
function checkAuth() {
  if (!getCurrentUser()) {
    window.location.href = "login.html";
  }
}

// LOAD PROFILE
async function loadProfile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) return;

  const res = await fetch("http://localhost:3000/api/users");
  const users = await res.json();

  const viewUser = localStorage.getItem("viewUser");

  let user;

  if (viewUser) {
    user = users.find((u) => u.username === viewUser);
  } else {
    user = users.find((u) => u.id === currentUser.id);
  }
  const followContainer = document.getElementById("followBtnContainer");

  if (user.id !== currentUser.id) {
    const isFollowing = user.followers.some(
      (f) => f.followerId === currentUser.id,
    );

    followContainer.innerHTML = `
    <button type="button" onclick="toggleFollow(${user.id})">
      ${isFollowing ? "Unfollow" : "Follow"}
    </button>
  `;
  } else {
    followContainer.innerHTML = "";
  }

  // update basic info
  document.getElementById("usernameDisplay").innerText = user.fullname;
  document.getElementById("handle").innerText = "@" + user.username;
  document.getElementById("bioText").innerText = user.bio;

  // 🔥 NEW: fetch posts
  const postsRes = await fetch("http://localhost:3000/api/posts");
  const posts = await postsRes.json();

  const userPosts = posts.filter((p) => p.userId === user.id);

  // update stats
  document.getElementById("postCount").innerText = userPosts.length;

  // followers / following (for now 0 until we build feature)
  document.getElementById("followerCount").innerText = user.followers.length;
  document.getElementById("followingCount").innerText = user.following.length;

  // likes (count all likes on user's posts)
  let totalLikes = 0;
  userPosts.forEach((p) => {
    totalLikes += p.likes.length;
  });

  document.getElementById("likeCount").innerText = totalLikes;

  // show posts
  const container = document.getElementById("posts");
  container.innerHTML = "";

  userPosts.forEach((p) => {
    container.innerHTML += `
  <div class="post-card">

    <div class="post-time">
      ${p.createdAt ? new Date(p.createdAt).toLocaleString() : "Just now"}
    </div>

    <p>${p.content}</p>

    <button class="comment-toggle-btn" onclick="toggleComments(${p.id})">
      💬 Comments (${p.comments.length})
    </button>

    <div id="comments-${p.id}" class="comments-section" style="display:none;">
      
      <div class="comments">
        ${p.comments
          .map(
            (c) => `
          <div class="comment">
            <strong>${c.user?.username || "unknown"}:</strong> ${c.text}
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="comment-box">
        <input id="comment-${p.id}" placeholder="Write a comment...">
        <button onclick="addComment(${p.id})">Post</button>
      </div>

    </div>

    ${
      currentUser && currentUser.id === p.userId
        ? `
      <button class="delete-btn" onclick="deletePost(${p.id})">
        🗑 Delete
      </button>
    `
        : ""
    }

  </div>
`;
  });

  // let viewUser = localStorage.getItem("viewUser");
  // let user;

  // if (viewUser) {
  //   user = getUsers().find(u => u.username === viewUser);
  // } else {
  //   user = getCurrentUser();
  // }

  // if (!user) return;

  // const currentUser = getCurrentUser();
  // const isOwner = currentUser && user.username === currentUser.username;

  // let posts = getPosts();
  // let myPosts = posts.filter(p => p.user === user.username);

  // // BASIC INFO
  // document.getElementById("usernameDisplay").innerText = user.username;
  // document.getElementById("handle").innerText = "@" + user.username;

  // document.getElementById("avatar").innerText =
  //   user.username.substring(0, 2).toUpperCase();

  // // POSTS COUNT
  // document.getElementById("postCount").innerText = myPosts.length;

  // // LIKES COUNT
  // let totalLikes = 0;
  // myPosts.forEach(p => {
  //   if (p.likes) totalLikes += p.likes.length;
  // });
  // document.getElementById("likeCount").innerText = totalLikes;

  // // FOLLOW COUNTS
  // document.getElementById("followerCount").innerText =
  //   user.followers ? user.followers.length : 0;

  // document.getElementById("followingCount").innerText =
  //   user.following ? user.following.length : 0;

  // // BIO
  // document.getElementById("bioText").innerText =
  //   user.bio || "Hey there! I am using Social Media.";

  // //EDIT BIO CONTROL
  // const editBtn = document.getElementById("editBtn");
  // const bioInput = document.getElementById("bioInput");
  // const saveBtn = document.getElementById("saveBtn");

  // if (isOwner) {
  //   editBtn.style.display = "inline";
  // } else {
  //   editBtn.style.display = "none";
  //   bioInput.style.display = "none";
  //   saveBtn.style.display = "none";
  // }

  // // FOLLOW BUTTON
  // const followContainer = document.getElementById("followBtnContainer");

  // if (user.username !== currentUser.username) {

  //   const isFollowing =
  //     currentUser.following &&
  //     currentUser.following.includes(user.username);

  //   followContainer.innerHTML = `
  //     <button class="follow-btn" onclick="toggleFollow('${user.username}')">
  //       ${isFollowing ? "Unfollow" : "Follow"}
  //     </button>
  //   `;
  // } else {
  //   followContainer.innerHTML = "";
  // }

  // // POSTS DISPLAY
  // const container = document.getElementById("posts");

  // if (myPosts.length === 0) {
  //   container.innerHTML = `<div class="card">No posts yet.</div>`;
  //   return;
  // }

  // container.innerHTML = myPosts.map(p => {

  //   if (!p.likes) p.likes = [];
  //   if (!p.comments) p.comments = [];

  //   return `
  //     <div class="post-card">

  //       <div class="post-time">
  //         ${p.timestamp ? formatTime(p.timestamp) : "Just now"}
  //       </div>

  //       <p>${p.content}</p>

  //       <button class="comment-toggle-btn" onclick="toggleComments(${p.id})">
  //         💬 Comments (${p.comments.length})
  //       </button>

  //       <div id="comments-${p.id}" class="comments-section" style="display:none;">
  //         <div class="comments">
  //           ${p.comments.map(c => `
  //             <div class="comment">
  //               <strong>${c.user}:</strong> ${c.text}
  //             </div>
  //           `).join("")}
  //         </div>

  //         <div class="comment-box">
  //           <input id="comment-${p.id}" placeholder="Write a comment...">
  //           <button onclick="addComment(${p.id})">Post</button>
  //         </div>
  //       </div>

  //       ${isOwner ? `
  //         <button class="delete-btn" onclick="deletePost(${p.id})">
  //           🗑 Delete
  //         </button>
  //       ` : ""}

  //     </div>
  //   `;
  // }).join("");
}
