"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", marginTop: 80, color: "#6b7280" }}>
          Loading statistics...
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: 80 }}>Failed to load stats.</p>
      </>
    );
  }

  const {
    platformTotals,
    avgFollowers,
    avgPosts,
    mostActiveUser,
    mostLikedPost,
    mostCommentedPost,
    topUsersByFollowers,
    mostEngagedUser,
  } = stats;

  return (
    <>
      <Navbar />
      <main className="main-container">

        <h2 style={{ marginBottom: 4 }}>📊 Platform Statistics</h2>
        <p style={{ color: "#6b7280", marginBottom: 24, marginTop: 0 }}>
          Live stats from the Linkora database
        </p>

        <section className="card">
          <h3 style={{ marginTop: 0 }}>Overview</h3>
          <div style={styles.totalsGrid}>
            <TotalCard label="Users" value={platformTotals.users} emoji="👤" />
            <TotalCard label="Posts" value={platformTotals.posts} emoji="📝" />
            <TotalCard label="Comments" value={platformTotals.comments} emoji="💬" />
            <TotalCard label="Likes" value={platformTotals.likes} emoji="❤️" />
            <TotalCard label="Follows" value={platformTotals.follows} emoji="🔗" />
          </div>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0 }}>Averages</h3>
          <div style={styles.twoCol}>
            <div style={styles.statBox}>
              <span style={styles.statEmoji}>👥</span>
              <span style={styles.statValue}>{avgFollowers}</span>
              <span style={styles.statLabel}>Avg. followers per user</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statEmoji}>📝</span>
              <span style={styles.statValue}>{avgPosts}</span>
              <span style={styles.statLabel}>Avg. posts per user</span>
            </div>
          </div>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0 }}>Highlights</h3>
          <div style={styles.twoCol}>
            {mostActiveUser && (
              <HighlightCard
                emoji="🔥"
                label="Most Active User (last 3 months)"
                title={mostActiveUser.user.fullname}
                sub={`@${mostActiveUser.user.username} — ${mostActiveUser.postCount} posts`}
              />
            )}
            {mostEngagedUser && (
              <HighlightCard
                emoji="⚡"
                label="Most Engaged User"
                title={mostEngagedUser.user.fullname}
                sub={`@${mostEngagedUser.user.username} — ${mostEngagedUser.engagementScore} interactions`}
              />
            )}
            {mostLikedPost && (
              <HighlightCard
                emoji="❤️"
                label="Most Liked Post"
                title={`@${mostLikedPost.post.user.username}`}
                sub={`"${truncate(mostLikedPost.post.content, 60)}" — ${mostLikedPost.likeCount} likes`}
              />
            )}
            {mostCommentedPost && (
              <HighlightCard
                emoji="💬"
                label="Most Commented Post"
                title={`@${mostCommentedPost.post.user.username}`}
                sub={`"${truncate(mostCommentedPost.post.content, 60)}" — ${mostCommentedPost.commentCount} comments`}
              />
            )}
          </div>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0 }}>🏆 Top 5 Most Followed Users</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Followers</th>
              </tr>
            </thead>
            <tbody>
              {topUsersByFollowers.map((item, i) => (
                <tr key={item.user.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</td>
                  <td style={styles.td}>{item.user.fullname}</td>
                  <td style={{ ...styles.td, color: "#2563eb" }}>@{item.user.username}</td>
                  <td style={styles.td}>{item.followerCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>
    </>
  );
}

function TotalCard({ label, value, emoji }) {
  return (
    <div style={styles.totalCard}>
      <span style={{ fontSize: 24 }}>{emoji}</span>
      <span style={styles.totalValue}>{value}</span>
      <span style={styles.totalLabel}>{label}</span>
    </div>
  );
}

function HighlightCard({ emoji, label, title, sub }) {
  return (
    <div style={styles.highlightCard}>
      <span style={{ fontSize: 20 }}>{emoji} <strong>{label}</strong></span>
      <p style={{ margin: "6px 0 2px", fontWeight: 700 }}>{title}</p>
      <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>{sub}</p>
    </div>
  );
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

const styles = {
  totalsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 12,
  },
  totalCard: {
    border: "1px solid #dce1e5",
    borderRadius: 10,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    background: "#f9fafb",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#2563eb",
  },
  totalLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  },
  statBox: {
    border: "1px solid #dce1e5",
    borderRadius: 10,
    padding: "16px",
    background: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  statEmoji: { fontSize: 22 },
  statValue: {
    fontSize: 32,
    fontWeight: 800,
    color: "#2563eb",
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  highlightCard: {
    border: "1px solid #dce1e5",
    borderLeft: "4px solid #2563eb",
    borderRadius: 10,
    padding: "14px 16px",
    background: "#f9fafb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  tableHead: { background: "#f3f4f6" },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontWeight: 700,
    color: "#374151",
    borderBottom: "1px solid #dce1e5",
  },
  td: {
    padding: "10px 14px",
    borderBottom: "1px solid #f3f4f6",
  },
  rowEven: { background: "#ffffff" },
  rowOdd: { background: "#f9fafb" },
};