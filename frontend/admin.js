// 🌍 PRODUCTION API BASE URL
const API_BASE_URL = "https://ni-wakati-sports-1.onrender.com/api/v1";

// --- ELEMENTS ---
const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const adminKeyInput = document.getElementById("admin-key");
const loginMessage = document.getElementById("login-message");
const subscribersTableBody = document.querySelector("#subscribersTable tbody");
const exportBtn = document.getElementById("exportCsvBtn");

// -----------------------------
// 🔐 TOKEN UTIL
// -----------------------------
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// -----------------------------
// 🔑 LOGIN
// -----------------------------
loginBtn.addEventListener("click", async () => {
  const password = adminKeyInput.value.trim();
  if (!password) return (loginMessage.textContent = "Password required");

  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "flexxngire01@gmail.com", password })
    });

    const data = await res.json();
    if (!res.ok) return (loginMessage.textContent = data.message || "Login failed");

    localStorage.setItem("adminToken", data.token);
    adminKeyInput.value = "";
    loginMessage.textContent = "";

    loadSubscribers();
  } catch (err) {
    console.error(err);
    loginMessage.textContent = "Server error";
  }
});

// -----------------------------
// 🚪 LOGOUT
// -----------------------------
logoutBtn.addEventListener("click", forceLogout);
function forceLogout() {
  localStorage.removeItem("adminToken");
  loginSection.style.display = "block";
  dashboard.style.display = "none";
  loginMessage.textContent = "Session expired. Please login again.";
  adminKeyInput.value = "";
  clearInterval(autoRefreshInterval);
}

// -----------------------------
// 📥 LOAD SUBSCRIBERS
// -----------------------------
let previousIds = new Set(); // for highlighting new subscribers
let autoRefreshInterval = null; // auto-refresh timer

async function loadSubscribers() {
  const token = localStorage.getItem("adminToken");
  if (!token || isTokenExpired(token)) return forceLogout();

  try {
    const res = await fetch(`${API_BASE_URL}/newsletter/subscribers`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) return forceLogout();
    if (!res.ok) throw new Error("Failed to load subscribers");

    const data = await res.json();
    const newIds = new Set(data.subscribers.map(s => s._id));

    subscribersTableBody.innerHTML = "";
    data.subscribers.forEach(sub => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${sub.email}</td>
        <td>${new Date(sub.createdAt).toLocaleString()}</td>
        <td><button onclick="deleteSubscriber('${sub._id}')">Delete</button></td>
      `;
      if (!previousIds.has(sub._id)) tr.classList.add("highlight");
      subscribersTableBody.appendChild(tr);
    });

    previousIds = newIds;

    loginSection.style.display = "none";
    dashboard.style.display = "block";
  } catch (err) {
    console.error(err);
    forceLogout();
  }
}

// -----------------------------
// 🗑️ DELETE SUBSCRIBER
// -----------------------------
async function deleteSubscriber(id) {
  if (!confirm("Are you sure you want to delete this subscriber?")) return;

  const token = localStorage.getItem("adminToken");
  if (!token || isTokenExpired(token)) return forceLogout();

  try {
    const res = await fetch(`${API_BASE_URL}/newsletter/subscribers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) return forceLogout();

    const data = await res.json();
    alert(data.message);
    loadSubscribers();
  } catch (err) {
    console.error(err);
    alert("Failed to delete subscriber");
  }
}

// -----------------------------
// 🔁 AUTO LOGIN ON PAGE LOAD
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  // Only force logout message if a token existed but expired
  if (token) {
    if (isTokenExpired(token)) {
      loginMessage.textContent = "Session expired. Please login again.";
      localStorage.removeItem("adminToken");
    } else {
      // Token valid, auto-login
      loadSubscribers();
      autoRefreshInterval = setInterval(loadSubscribers, 30000);
    }
  }
  // If no token exists, do nothing — show login form clean
});


// -----------------------------
// 📥 EXPORT CSV
// -----------------------------
exportBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return alert("Session expired. Please login again.");

  try {
    const res = await fetch(`${API_BASE_URL}/admin/newsletter/export`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to download CSV");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert("CSV export failed");
  }
});
