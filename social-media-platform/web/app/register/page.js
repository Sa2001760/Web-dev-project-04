"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered!");
        router.push("/login");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="Auth">
      <main>
        <section className="auth-card">
          <header>
            <h2>Create Account</h2>
            <p className="subtitle">Join our social media platform</p>
          </header>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                id="fullname"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                placeholder="Choose a username"
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
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn" type="submit">Register</button>
          </form>

          <p className="auth-link">
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </section>
      </main>
    </div>
  );
}