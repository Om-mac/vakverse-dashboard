const API_BASE = "https://vakverse-backend.onrender.com";

// Toggle password field visibility
function toggleDoorInput() {
  const wrapper = document.getElementById("doorInputWrapper");
  const btn = document.getElementById("doorBtn");

  if (wrapper.classList.contains("hidden")) {
    wrapper.classList.remove("hidden");
    btn.innerText = "🔓 Enter Password";
  } else {
    wrapper.classList.add("hidden");
    btn.innerText = "🔒 Open Door";
  }
}

// Fetch and update sensor data
async function fetchData() {
  try {
    const res = await fetch(`${API_BASE}/data`);
    const data = await res.json();

    document.getElementById("temp").innerText = data.temp + " °C";
    document.getElementById("hum").innerText = data.hum + " %";
    document.getElementById("mq2").innerText = data.mq2;
    document.getElementById("mq6").innerText = data.mq6;
    document.getElementById("flame").innerText =
      data.flame == 0 ? "🔥 Detected ⚠️" : "✅ Safe";

    const flameCard = document.getElementById("flameCard");
    if (data.flame == 0) {
      flameCard.style.boxShadow = "0 0 25px rgba(255, 77, 77, 0.8)";
      document.getElementById("flame").classList.add("alert");
    } else {
      flameCard.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
      document.getElementById("flame").classList.remove("alert");
    }
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
}

// Master-style door unlock flow
async function openDoor() {
  const passwordInput = document.getElementById("doorPassword");
  const password = passwordInput.value.trim();
  const status = document.getElementById("doorStatus");
  const doorBtn = document.getElementById("doorBtn");

  if (!password) {
    status.innerText = "⚠️ Please enter the password.";
    status.className = "status-text status-fail";
    passwordInput.focus();
    return;
  }

  // Show verifying animation
  doorBtn.innerText = "⏳ Verifying...";
  doorBtn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/open-door`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const msg = await res.json();

    if (res.ok) {
      status.innerText = "✅ Door Opened Successfully!";
      status.className = "status-text status-success";
      doorBtn.innerText = "✅ Door Opened";
      passwordInput.value = "";
    } else {
      status.innerText = "🚫 Access Denied";
      status.className = "status-text status-fail shake";
      setTimeout(() => status.classList.remove("shake"), 300);
      doorBtn.innerText = "🔒 Try Again";
    }
  } catch (err) {
    console.error("Error:", err);
    status.innerText = "⚠️ Connection error.";
    status.className = "status-text status-fail";
    doorBtn.innerText = "🔒 Try Again";
  }

  // Reset after a short delay
  setTimeout(() => {
    doorBtn.disabled = false;
    doorBtn.innerText = "🔒 Open Door";
    document.getElementById("doorInputWrapper").classList.add("hidden");
  }, 2500);
}

setInterval(fetchData, 1000);
window.onload = fetchData;