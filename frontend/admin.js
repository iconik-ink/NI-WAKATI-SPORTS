// 🌍 PRODUCTION API BASE URL
const API_BASE_URL = "https://ni-wakati-sports-1.onrender.com/api/v1";

// --- ELEMENTS ---
const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const adminKeyInput = document.getElementById("admin-key");
const loginMessage = document.getElementById("login-message");
const subscribersList = document.getElementById("subscribers-list");

// --- LOGIN ---
loginBtn.addEventListener("click", async () => {
  const password = adminKeyInput.value.trim();

  if (!password) {
    loginMessage.textContent = "Password required";
    return;
  }

  try {
 const res = await fetch(`${API_BASE_URL}/admin/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "flexxngire01@gmail.com", // must match ADMIN_EMAIL
    password
  })
});



    const data = await res.json();

    if (!res.ok) {
      loginMessage.textContent = data.message || "Login failed";
      return;
    }

    // ✅ Save JWT
    localStorage.setItem("adminToken", data.token);

    adminKeyInput.value = "";
    loginMessage.textContent = "";

    loadSubscribers();
  } catch (err) {
    console.error(err);
    loginMessage.textContent = "Server error";
  }
});

// --- LOGOUT ---
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  dashboard.style.display = "none";
  loginSection.style.display = "block";
  loginMessage.textContent = "";
  adminKeyInput.value = "";
});

// --- LOAD SUBSCRIBERS ---
async function loadSubscribers() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    forceLogout();
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/newsletter/subscribers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();

    subscribersList.innerHTML = "";

    data.subscribers.forEach(sub => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${sub.email}
        <button onclick="deleteSubscriber('${sub._id}')">Delete</button>
      `;
      subscribersList.appendChild(li);
    });

    loginSection.style.display = "none";
    dashboard.style.display = "block";
  } catch (err) {
    console.error(err);
    forceLogout();
  }
}

// --- DELETE SUBSCRIBER ---
async function deleteSubscriber(id) {
  if (!confirm("Are you sure you want to delete this subscriber?")) return;

  const token = localStorage.getItem("adminToken");
  if (!token) {
    forceLogout();
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/newsletter/subscribers/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();
    alert(data.message);

    loadSubscribers();
  } catch (err) {
    console.error(err);
    alert("Failed to delete subscriber");
  }
}

// --- AUTO LOGIN ---
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("adminToken")) {
    loadSubscribers();
  }
});

// --- FORCE LOGOUT ---
function forceLogout() {
  localStorage.removeItem("adminToken");
  loginSection.style.display = "block";
  dashboard.style.display = "none";
  loginMessage.textContent = "Session expired. Please login again.";
}
