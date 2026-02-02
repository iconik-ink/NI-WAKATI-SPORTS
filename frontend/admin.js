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
// 🔐 JWT UTIL
// -----------------------------
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getTokenPayload(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// -----------------------------
// 🔑 LOGIN
// -----------------------------
loginBtn.addEventListener("click", async () => {
  const keyOrPassword = adminKeyInput.value.trim();
  if (!keyOrPassword) return (loginMessage.textContent = "Password or key required");

  try {
    const isTemp = keyOrPassword.startsWith("TEMP-");
    const url = isTemp
      ? `${API_BASE_URL}/admin/login-temp`
      : `${API_BASE_URL}/admin/login`;

    const body = isTemp
      ? JSON.stringify({ key: keyOrPassword })
      : JSON.stringify({ email: "flexxngire01@gmail.com", password: keyOrPassword });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await res.json();
    if (!res.ok) return (loginMessage.textContent = data.message || "Login failed");

    localStorage.setItem("adminToken", data.token);
    adminKeyInput.value = "";
    loginMessage.textContent = "";

    const payload = getTokenPayload(data.token);
    if (payload?.temp) {
      loginMessage.textContent = "Temporary admin access (read-only)";
    }

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
let previousIds = new Set();
let autoRefreshInterval = null;

async function loadSubscribers() {
  const token = localStorage.getItem("adminToken");
  if (!token || isTokenExpired(token)) return forceLogout();

  try {
    const payload = getTokenPayload(token);
    const isTempAdmin = payload?.temp === true;

    const res = await fetch(`${API_BASE_URL}/newsletter/subscribers`, {
      headers: { Authorization: `Bearer ${token}` },
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
        <td>${isTempAdmin ? "" : `<button onclick="deleteSubscriber('${sub._id}')">Delete</button>`}</td>
      `;
      if (!previousIds.has(sub._id)) tr.classList.add("highlight");
      subscribersTableBody.appendChild(tr);
    });

    previousIds = newIds;

    loginSection.style.display = "none";
    dashboard.style.display = "block";

    // TEMP banner
    if (isTempAdmin) loginMessage.textContent = "⚠️ Temporary admin access (read-only)";
  } catch (err) {
    console.error(err);
    forceLogout();
  }
}

// -----------------------------
// 🗑️ DELETE SUBSCRIBER
// -----------------------------
async function deleteSubscriber(id) {
  const token = localStorage.getItem("adminToken");
  if (!token || isTokenExpired(token)) return forceLogout();

  const payload = getTokenPayload(token);
  if (payload?.temp) return alert("Delete disabled for temporary admin access");

  if (!confirm("Are you sure you want to delete this subscriber?")) return;

  try {
    const res = await fetch(`${API_BASE_URL}/newsletter/subscribers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
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

  if (token) {
    if (isTokenExpired(token)) {
      loginMessage.textContent = "Session expired. Please login again.";
      localStorage.removeItem("adminToken");
    } else {
      loadSubscribers();
      autoRefreshInterval = setInterval(loadSubscribers, 30000);
    }
  }
});

// -----------------------------
// 📥 EXPORT CSV
// -----------------------------
exportBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return alert("Session expired. Please login again.");

  const payload = getTokenPayload(token);
  if (payload?.temp) return alert("CSV export disabled for temporary admin access");

  try {
    const res = await fetch(`${API_BASE_URL}/admin/newsletter/export`, {
      headers: { Authorization: `Bearer ${token}` },
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
// -----------------------------
// 🆕 GENERATE TEMP KEY (Full admins only)
// -----------------------------
const generateTempKeyBtn = document.getElementById("generateTempKeyBtn");
const newTempKeyInput = document.getElementById("newTempKey");

generateTempKeyBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("adminToken");
  if (!token || isTokenExpired(token)) return forceLogout();

  const payload = getTokenPayload(token);
  if (payload?.temp) return alert("Temporary admins cannot generate TEMP keys");

  try {
    const res = await fetch(`${API_BASE_URL}/admin/generate-temp-key`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to generate TEMP key");
    }

    const data = await res.json();
    newTempKeyInput.value = data.key;

    // Auto-copy to clipboard
    navigator.clipboard.writeText(data.key);
    alert("New TEMP key generated and copied to clipboard!");
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to generate TEMP key");
  }
});
