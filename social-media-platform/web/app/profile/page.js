"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const cu = JSON.parse(localStorage.getItem("currentUser"));
    if (!cu) {
      router.push("/login");
      return;
    }
    setCurrentUser(cu);
    loadProfile(cu);
  }, []);

  async function loadProfile(cu) {
    const res = await fetch("/api/users");
    const users = await res.json();

    const viewUser = localStorage.getItem("viewUser");
    let profileUser;

    if (viewUser) {
      profileUser = users.find((u) => u.username === viewUser);
    } else {
      profileUser = users.find((u) => u.id === cu.id);
    }

    if (!profileUser) return;

    setUser(profileUser);
    setBioInput(profileUser.bio);

    const owner = profileUser.id === cu.id;
    setIsOwner(owner);

    if (!owner) {
      const following = profileUser.followers.some(
        (f) => f.followerId === cu.id
      );
      setIsFollowing(following);
    }

    const postsRes = await fetch("/api/posts");
    const allPosts = await postsRes.json();
    const userPosts = allPosts.filter((p) => p.userId === profileUser.id);
    setPosts(userPosts);
  }

 async function toggleFollow() {
  if (!currentUser || !user) return;

  try {
    const res = await fetch("/api/follow", {
      method: isFollowing ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: currentUser.id,
        followingId: user.id,
      }),
    });

    const data = await res.json();
    console.log("Follow response:", res.status, data);

    if (!res.ok) {
      alert("Error: " + JSON.stringify(data));
      return;
    }

    loadProfile(currentUser);
  } catch (err) {
    console.error("Follow fetch failed:", err);
    alert("Network error - check console");
  }
}

  async function saveBio() {
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentUser.id, bio: bioInput }),
    });
    const updatedUser = await res.json();
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setEditingBio(false);
    loadProfile(currentUser);
  }

  async function deletePost(postId) {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId: currentUser.id }),
    });
    loadProfile(currentUser);
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
    loadProfile(currentUser);
  }

  function toggleComments(postId) {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  if (!user) return <><Navbar /><p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p></>;

  const totalLikes = posts.reduce((sum, p) => sum + p.likes.length, 0);

  return (
    <>
      <Navbar />
      <main className="main-container">
        {/* Profile Card */}
        <section className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.fullname[0].toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0 }}>{user.fullname}</h2>
              <p style={{ margin: "2px 0", color: "#6b7280" }}>@{user.username}</p>

              {/* Bio */}
              {editingBio ? (
                <div style={{ marginTop: 8 }}>
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    style={{ height: 60, marginTop: 0 }}
                  />
                  <button className="btn" style={{ width: "auto", padding: "6px 16px", marginTop: 6 }} onClick={saveBio}>Save</button>
                  <button onClick={() => setEditingBio(false)} style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>Cancel</button>
                </div>
              ) : (
                <div style={{ marginTop: 8 }}>
                  <p style={{ margin: 0 }}>{user.bio || "No bio yet."}</p>
                  {isOwner && (
                    <button onClick={() => setEditingBio(true)} style={{ marginTop: 6, background: "#e5e7eb", border: "none", padding: "5px 12px", borderRadius: 8, cursor: "pointer" }}>
                      Edit Bio
                    </button>
                  )}
                </div>
              )}

              {/* Follow button */}
              {!isOwner && (
                <button className="follow-btn" onClick={toggleFollow}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}

              {/* Stats */}
              <div className="profile-stats">
                <span>{posts.length}</span> Posts |{" "}
                <span>{user.followers.length}</span> Followers |{" "}
                <span>{user.following.length}</span> Following |{" "}
                <span>{totalLikes}</span> Likes
              </div>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section>
          <h3>Posts</h3>

          {posts.length === 0 && <p>No posts yet.</p>}

          {posts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-time">
                {new Date(post.createdAt).toLocaleString()}
              </div>

              <p>{post.content}</p>

              <button
                className="comment-toggle-btn"
                onClick={() => toggleComments(post.id)}
              >
                💬 Comments ({post.comments.length})
              </button>

              {openComments[post.id] && (
                <div className="comments-section">
                  <div className="comments">
                    {post.comments.map((c, i) => (
                      <div className="comment" key={i}>
                        <strong>{c.user?.username || "unknown"}:</strong> {c.text}
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
                    <button onClick={() => addComment(post.id)}>Post</button>
                  </div>
                </div>
              )}

              {isOwner && (
                <button className="delete-btn" onClick={() => deletePost(post.id)}>
                  🗑 Delete
                </button>
              )}
            </div>
          ))}
        </section>
      </main>
    </>
  );
}