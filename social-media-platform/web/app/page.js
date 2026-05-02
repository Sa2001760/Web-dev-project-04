"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [currentFeed, setCurrentFeed] = useState("recent");
  const [searchInput, setSearchInput] = useState("");
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUser(user);
    loadPosts(user, "recent");
  }, []);

  async function loadPosts(user, feedType) {
    try {
      const res = await fetch("/api/posts");
      let data = await res.json();

      if (feedType === "following") {
        const usersRes = await fetch("/api/users");
        const users = await usersRes.json();
        const me = users.find((u) => u.id === user.id);
        const followingIds = me.following.map((f) => f.followingId);
        data = data.filter((p) => followingIds.includes(p.userId));
      }

      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  }

  function switchFeed(type) {
    setCurrentFeed(type);
    loadPosts(currentUser, type);
  }

  async function createPost() {
    if (!postContent.trim() || !currentUser) return;
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: postContent, userId: currentUser.id }),
    });
    setPostContent("");
    loadPosts(currentUser, currentFeed);
  }

  async function toggleLike(postId) {
    if (!currentUser) return;
    const post = posts.find((p) => p.id === postId);
    const alreadyLiked = post.likes.some((l) => l.userId === currentUser.id);

    if (alreadyLiked) {
      await fetch("/api/likes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, postId }),
      });
    } else {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, postId }),
      });
    }
    loadPosts(currentUser, currentFeed);
  }

  async function addComment(postId) {
    if (!currentUser) return;
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, userId: currentUser.id, postId }),
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    loadPosts(currentUser, currentFeed);
  }

  function toggleComments(postId) {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  function searchUser() {
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    fetch("/api/users")
      .then((r) => r.json())
      .then((users) => {
        const user = users.find((u) => u.username.toLowerCase() === query);
        if (!user) {
          alert("User not found");
          return;
        }
        localStorage.setItem("viewUser", user.username);
        router.push("/profile");
      });
  }

  function viewProfile(username) {
    localStorage.setItem("viewUser", username);
    router.push("/profile");
  }

  return (
    <>
      <Navbar />
      <main className="main-container">
        {/* Create Post */}
        <section className="card">
          <h3>Create a Post</h3>
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <button className="btn post-btn" onClick={createPost}>Post</button>
        </section>

        {/* Feed */}
        <section>
          <h3>Posts</h3>
          <div className="feed-tabs">
            <button
              onClick={() => switchFeed("recent")}
              className={currentFeed === "recent" ? "active" : ""}
            >
              Recent
            </button>
            <button
              onClick={() => switchFeed("following")}
              className={currentFeed === "following" ? "active" : ""}
            >
              Following
            </button>

            <div className="search-box">
              <input
                placeholder="Search username..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchUser()}
              />
              <button onClick={searchUser}>Search</button>
            </div>
          </div>

          {posts.length === 0 && <p>No posts yet...</p>}

          {posts.map((post) => {
            const alreadyLiked =
              currentUser &&
              post.likes.some((l) => l.userId === currentUser.id);

            return (
              <div className="post-card" key={post.id}>
                <div className="post-header">
                  <div className="avatar">
                    {post.user.fullname[0].toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{ cursor: "pointer", fontWeight: "bold", margin: 0 }}
                      onClick={() => viewProfile(post.user.username)}
                    >
                      {post.user.username}
                    </p>
                    <span className="post-time">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p>{post.content}</p>

                <button
                  className={`like-btn${alreadyLiked ? " liked" : ""}`}
                  onClick={() => toggleLike(post.id)}
                >
                  ❤️ {post.likes.length}
                </button>

                <button
                  className="comment-toggle-btn"
                  onClick={() => toggleComments(post.id)}
                  style={{ marginLeft: 8 }}
                >
                  💬 Comments ({post.comments.length})
                </button>

                {openComments[post.id] && (
                  <div className="comments-section">
                    <div className="comments">
                      {post.comments.map((c, i) => (
                        <div className="comment" key={i}>
                          <b>{c.user?.username || "unknown"}:</b> {c.text}
                        </div>
                      ))}
                    </div>
                    <div className="comment-box">
                      <input
                        placeholder="Write a comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && addComment(post.id)
                        }
                      />
                      <button onClick={() => addComment(post.id)}>Comment</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}