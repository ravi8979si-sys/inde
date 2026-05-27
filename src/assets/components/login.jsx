import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import SignUp from "../components/Signup.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const BASE_URL = "https://inde-hpbc.onrender.com";

  // 🔁 AUTO LOGIN
  useEffect(() => {
    const session =
      JSON.parse(localStorage.getItem("session")) ||
      JSON.parse(sessionStorage.getItem("session"));

    if (session?.username) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg("");
  setLoading(true);

  try {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(), // 🔥 FIX
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      const sessionData = {
  _id: data.user._id,      // 🔥 ADD THIS
  username: data.user.username,
  name: data.user.name,
  role: data.user.role,
};


      if (remember) {
        localStorage.setItem("session", JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem("session", JSON.stringify(sessionData));
      }

      setIsLoggedIn(true);
      setMsg(data.message || "Login successful ✅");
    } else {
      setMsg(data.message || "Invalid username or password ❌");
    }
  } catch (error) {
    console.error("Login error:", error);
    setMsg("Server error ❌");
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  // 🔀 REDIRECTS
  if (isLoggedIn) return <Dashboard onLogout={handleLogout} />;
  if (showSignup) return <SignUp />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#6a11cb] to-[#2575fc]">
      <div className="relative w-full max-w-sm rounded-2xl bg-white/90 shadow-2xl p-6 sm:p-8">
        <div className="absolute -top-7 left-1/2 -translate-x-1/2">
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-2xl grid place-items-center">
            ₹
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-xl font-semibold">Indepay Partner</h1>
          <p className="text-sm text-slate-500">
            Sign in to manage your accounts & earnings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="h-11 w-full rounded-xl border px-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 w-full rounded-xl border px-4"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Checking..." : "Login"}
          </button>

          {msg && (
            <p className="text-center text-sm text-red-600">{msg}</p>
          )}
        </form>

        <p className="mt-4 text-center text-sm">
          New here?{" "}
          <button
            onClick={() => setShowSignup(true)}
            className="text-indigo-600 underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
