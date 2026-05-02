"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/users");
      const users = await res.json();

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        alert("Invalid credentials");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="Auth">
      <main>
        <section className="auth-card">
          <header>
            <h2>Welcome Back</h2>
            <p className="subtitle">Login to your account</p>
          </header>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn" type="submit">Login</button>
          </form>

          <p className="auth-link">
            Don&apos;t have an account? <Link href="/register">Register here</Link>
          </p>
        </section>
      </main>
    </div>
  );
}