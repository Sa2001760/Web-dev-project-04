"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("currentUser");
    router.push("/login");
  }

  function goToProfile() {
    localStorage.removeItem("viewUser");
    router.push("/profile");
  }

  return (
    <nav className="navbar">
      <div className="logo">Linkora</div>
      <div className="nav-links">
        <a onClick={() => router.push("/")}>🏠 Home</a>
        <a onClick={goToProfile}>👤 Profile</a>
        <a onClick={() => router.push("/stats")}>📊 Stats</a>
        <a onClick={logout}>🚪 Logout</a>
      </div>
    </nav>
  );
}