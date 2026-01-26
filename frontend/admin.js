

const API_URL = "http://localhost:4000/api/v1/newsletter";

// --- ELEMENTS ---
const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const adminKeyInput = document.getElementById("admin-key");
const loginMessage = document.getElementById("login-message");
const subscribersList = document.getElementById("subscribers-list");

// --- LOGIN HANDLER ---
loginBtn.addEventListener("click", async () => {
  const password = adminKeyInput.value.trim();

  if (!password) {
    loginMessage.textContent = "Password required";
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/v1/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      loginMessage.textContent = data.message || "Login failed";
      return;
    }

    // ✅ Save JWT to localStorage
    localStorage.setItem("adminToken", data.token);

    // Clear input
    adminKeyInput.value = "";

    // Load subscribers
    loadSubscribers();
  } catch (err) {
    console.error(err);
    loginMessage.textContent = "Server error";
  }
});

// --- LOGOUT HANDLER ---
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
    loginMessage.textContent = "Session expired. Please login again.";
    loginSection.style.display = "block";
    dashboard.style.display = "none";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/subscribers`, {
      headers: { Authorization: "Bearer " + token }
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

    // Show dashboard
    loginSection.style.display = "none";
    dashboard.style.display = "block";
    loginMessage.textContent = "";
  } catch (err) {
    console.error(err);
    loginMessage.textContent = "Session expired. Please login again.";
    localStorage.removeItem("adminToken");
    loginSection.style.display = "block";
    dashboard.style.display = "none";
  }
}

// --- AUTO-LOGIN IF TOKEN EXISTS ---
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("adminToken")) {
    loadSubscribers();
  }
});

// --- DELETE SUBSCRIBER ---
async function deleteSubscriber(id) {
  if (!confirm("Are you sure you want to delete this subscriber?")) return;

  const token = localStorage.getItem("adminToken");
  if (!token) {
    loginMessage.textContent = "Session expired. Please login again.";
    loginSection.style.display = "block";
    dashboard.style.display = "none";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/subscribers/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();
    alert(data.message);

    loadSubscribers(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Failed to delete subscriber");
  }
}
