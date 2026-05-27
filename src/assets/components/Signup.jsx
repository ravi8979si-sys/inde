import React, { useState } from "react";
import Login from "./login.jsx";

const BASE_URL = "https://inde-hpbc.onrender.com";

export default function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    if (!name || !username || !password || !confirm) {
      setMsg("Please fill all fields ❌");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match ❌");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          password,
          role: "user", // 🔐 DEFAULT ROLE
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg(data.message || "Account created successfully ✅");
        setTimeout(() => setShowLogin(true), 1200);
      } else {
        setMsg(data.message || "Signup failed ❌");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error ❌");
    }

    setLoading(false);
  };

  if (showLogin) return <Login />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#6a11cb] to-[#2575fc]">
      <div className="relative w-full max-w-sm rounded-2xl bg-white/90 shadow-2xl p-6 sm:p-8">

        <h1 className="text-xl font-semibold text-slate-800 text-center">
          Create Account
        </h1>
        <p className="text-sm text-slate-500 text-center mb-4">
          Join Indepay Partner Dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold shadow-lg disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {msg && (
          <p
            className={`text-center mt-2 text-sm ${
              msg.includes("success")
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {msg}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            onClick={() => setShowLogin(true)}
            className="text-indigo-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
